package com.cricketpro.service;

import com.cricketpro.dto.AuctionDTO;
import com.cricketpro.model.*;
import com.cricketpro.model.enums.AuctionStatus;
import com.cricketpro.model.enums.PlayerQueueStatus;
import com.cricketpro.model.enums.TournamentStatus;
import com.cricketpro.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionService {

    private final AuctionSessionRepository sessionRepo;
    private final AuctionBidRepository bidRepo;
    private final AuctionPlayerQueueRepository queueRepo;
    private final TeamRepository teamRepo;
    private final TournamentRepository tournamentRepo;
    private final SimpMessagingTemplate messagingTemplate;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm:ss");

    // ── Setup: Create auction session for a tournament ──
    @Transactional
    public AuctionSession createSession(Long tournamentId) {
        Tournament tournament = tournamentRepo.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        if (sessionRepo.findByTournamentId(tournamentId).isPresent()) {
            throw new IllegalStateException("Auction session already exists for this tournament");
        }

        AuctionSession session = AuctionSession.builder()
                .tournament(tournament)
                .status(AuctionStatus.SETUP)
                .timerSecondsRemaining(tournament.getBidTimerSeconds())
                .build();

        tournament.setStatus(TournamentStatus.AUCTION_PHASE);
        tournamentRepo.save(tournament);

        return sessionRepo.save(session);
    }

    // ── Add player to auction queue ──
    @Transactional
    public AuctionPlayerQueue addPlayerToQueue(Long sessionId, Long playerId, Long basePrice, Integer order) {
        AuctionSession session = getSession(sessionId);
        // Actual Player lookup deferred — use reference
        Player player = new Player();
        player.setId(playerId);

        AuctionPlayerQueue queueEntry = AuctionPlayerQueue.builder()
                .session(session)
                .player(player)
                .queueOrder(order)
                .basePrice(basePrice != null ? basePrice : 1000L)
                .status(PlayerQueueStatus.PENDING)
                .build();

        return queueRepo.save(queueEntry);
    }

    // ── Start auction: move to first player ──
    @Transactional
    public void startAuction(Long tournamentId) {
        AuctionSession session = sessionRepo.findByTournamentId(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("No auction session found"));

        if (session.getStatus() != AuctionStatus.SETUP && session.getStatus() != AuctionStatus.READY) {
            throw new IllegalStateException("Auction cannot be started from state: " + session.getStatus());
        }

        session.setStatus(AuctionStatus.ACTIVE);
        session.setStartedAt(LocalDateTime.now());
        sessionRepo.save(session);

        // Start with first player
        advanceToNextPlayer(session);

        log.info("🏏 Auction STARTED for tournament {}", tournamentId);
    }

    // ── Place a bid ──
    @Transactional
    public AuctionDTO.BidEvent placeBid(Long tournamentId, Long teamId, Long amount) {
        AuctionSession session = sessionRepo.findByTournamentId(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("No auction session found"));

        // Validate auction state
        if (session.getStatus() != AuctionStatus.ACTIVE) {
            throw new IllegalStateException("Auction is not active");
        }

        AuctionPlayerQueue currentEntry = queueRepo.findFirstBySessionIdAndStatusOrderByQueueOrder(
                session.getId(), PlayerQueueStatus.BIDDING)
                .orElseThrow(() -> new IllegalStateException("No player currently up for bidding"));

        // Validate bid amount
        Long minBid = session.getCurrentHighestBid() > 0
                ? session.getCurrentHighestBid() + session.getTournament().getMinBidIncrement()
                : currentEntry.getBasePrice();

        if (amount < minBid) {
            throw new IllegalArgumentException("Bid must be at least ₹" + minBid);
        }

        // Validate team budget (with optimistic locking via @Version)
        Team team = teamRepo.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        if (team.getBudgetRemaining() < amount) {
            throw new IllegalArgumentException("Insufficient budget. Remaining: ₹" + team.getBudgetRemaining());
        }

        // Validate team belongs to this tournament
        if (!team.getTournament().getId().equals(session.getTournament().getId())) {
            throw new IllegalArgumentException("Team does not belong to this tournament");
        }

        // Store previous highest team for outbid notification
        Team previousHighestTeam = session.getCurrentHighestTeam();

        // Save bid
        AuctionBid bid = AuctionBid.builder()
                .session(session)
                .player(currentEntry.getPlayer())
                .team(team)
                .amount(amount)
                .bidTime(LocalDateTime.now())
                .build();
        bidRepo.save(bid);

        // Update session state
        session.setCurrentHighestBid(amount);
        session.setCurrentHighestTeam(team);
        session.setTimerSecondsRemaining(session.getTournament().getBidTimerSeconds()); // Reset timer
        sessionRepo.save(session);

        // Create bid event
        AuctionDTO.BidEvent event = new AuctionDTO.BidEvent();
        event.setTeamName(team.getName());
        event.setTeamIcon(team.getLogoIcon());
        event.setAmount(amount);
        event.setBidTime(LocalDateTime.now().format(TIME_FMT));
        event.setPlayerName(currentEntry.getPlayer().getUser() != null
                ? currentEntry.getPlayer().getUser().getName() : "Player #" + currentEntry.getPlayer().getId());
        event.setHighest(true);

        // Broadcast bid to ALL subscribers (War Room)
        messagingTemplate.convertAndSend(
                "/topic/auction/" + tournamentId + "/feed", event);

        // Broadcast timer reset
        AuctionDTO.TimerUpdate timerUpdate = new AuctionDTO.TimerUpdate();
        timerUpdate.setSecondsRemaining(session.getTimerSecondsRemaining());
        timerUpdate.setCurrentBid(amount);
        timerUpdate.setCurrentTeam(team.getName());
        messagingTemplate.convertAndSend(
                "/topic/auction/" + tournamentId, timerUpdate);

        // Notify outbid team (private message)
        if (previousHighestTeam != null && !previousHighestTeam.getId().equals(teamId)) {
            messagingTemplate.convertAndSendToUser(
                    previousHighestTeam.getOwner().getId().toString(),
                    "/queue/auction/outbid",
                    "You were outbid! Current bid: ₹" + amount + " by " + team.getName());
        }

        log.info("💰 BID: {} bid ₹{} on player {} in tournament {}",
                team.getName(), amount, currentEntry.getPlayer().getId(), tournamentId);

        return event;
    }

    // ── Process SOLD: timer reached 0 with bids ──
    @Transactional
    public void processSold(AuctionSession session) {
        AuctionPlayerQueue currentEntry = queueRepo.findFirstBySessionIdAndStatusOrderByQueueOrder(
                session.getId(), PlayerQueueStatus.BIDDING).orElse(null);

        if (currentEntry == null) return;

        if (session.getCurrentHighestBid() > 0 && session.getCurrentHighestTeam() != null) {
            // SOLD!
            Team winningTeam = session.getCurrentHighestTeam();
            Long soldPrice = session.getCurrentHighestBid();

            // Update queue entry
            currentEntry.setStatus(PlayerQueueStatus.SOLD);
            currentEntry.setSoldPrice(soldPrice);
            currentEntry.setSoldTeam(winningTeam);
            queueRepo.save(currentEntry);

            // Deduct budget from team
            winningTeam.setBudgetRemaining(winningTeam.getBudgetRemaining() - soldPrice);
            winningTeam.setPlayersBought(winningTeam.getPlayersBought() + 1);
            winningTeam.getPlayers().add(currentEntry.getPlayer());
            teamRepo.save(winningTeam);

            // Update auction pot
            session.setTotalAuctionPot(session.getTotalAuctionPot() + soldPrice);

            // Broadcast SOLD event
            AuctionDTO.SoldEvent soldEvent = new AuctionDTO.SoldEvent();
            soldEvent.setPlayerName(currentEntry.getPlayer().getUser() != null
                    ? currentEntry.getPlayer().getUser().getName() : "Player #" + currentEntry.getPlayer().getId());
            soldEvent.setPlayerId(currentEntry.getPlayer().getId());
            soldEvent.setTeamName(winningTeam.getName());
            soldEvent.setTeamId(winningTeam.getId());
            soldEvent.setSoldPrice(soldPrice);
            soldEvent.setTeamIcon(winningTeam.getLogoIcon());

            messagingTemplate.convertAndSend(
                    "/topic/auction/" + session.getTournament().getId(),
                    java.util.Map.of("type", "SOLD", "data", soldEvent));

            log.info("🔨 SOLD: Player {} → {} for ₹{}",
                    currentEntry.getPlayer().getId(), winningTeam.getName(), soldPrice);
        } else {
            // UNSOLD — no bids
            currentEntry.setStatus(PlayerQueueStatus.UNSOLD);
            queueRepo.save(currentEntry);

            messagingTemplate.convertAndSend(
                    "/topic/auction/" + session.getTournament().getId(),
                    java.util.Map.of("type", "UNSOLD", "playerName",
                            currentEntry.getPlayer().getUser() != null
                                    ? currentEntry.getPlayer().getUser().getName()
                                    : "Player #" + currentEntry.getPlayer().getId()));

            log.info("❌ UNSOLD: Player {}", currentEntry.getPlayer().getId());
        }

        // Move to next player
        advanceToNextPlayer(session);
    }

    // ── Advance to next player in queue ──
    @Transactional
    public void advanceToNextPlayer(AuctionSession session) {
        var nextEntry = queueRepo.findFirstBySessionIdAndStatusOrderByQueueOrder(
                session.getId(), PlayerQueueStatus.PENDING);

        if (nextEntry.isEmpty()) {
            // Auction complete!
            session.setStatus(AuctionStatus.COMPLETED);
            session.setCompletedAt(LocalDateTime.now());
            session.setCurrentPlayer(null);
            session.setCurrentHighestBid(0L);
            session.setCurrentHighestTeam(null);
            sessionRepo.save(session);

            messagingTemplate.convertAndSend(
                    "/topic/auction/" + session.getTournament().getId(),
                    java.util.Map.of("type", "COMPLETED", "totalPot", session.getTotalAuctionPot()));

            log.info("🏆 AUCTION COMPLETED for tournament {}. Total pot: ₹{}",
                    session.getTournament().getId(), session.getTotalAuctionPot());
            return;
        }

        AuctionPlayerQueue entry = nextEntry.get();
        entry.setStatus(PlayerQueueStatus.INTRO);
        queueRepo.save(entry);

        // Reset session for new player
        session.setCurrentPlayer(entry.getPlayer());
        session.setCurrentHighestBid(0L);
        session.setCurrentHighestTeam(null);
        session.setTimerSecondsRemaining(session.getTournament().getBidTimerSeconds());
        sessionRepo.save(session);

        // Broadcast player intro
        AuctionDTO.PlayerIntro intro = buildPlayerIntro(entry);
        messagingTemplate.convertAndSend(
                "/topic/auction/" + session.getTournament().getId(),
                java.util.Map.of("type", "PLAYER_INTRO", "data", intro));

        // After intro period, transition to BIDDING (handled by timer service)
        log.info("📢 INTRO: Player {} up next in tournament {}",
                entry.getPlayer().getId(), session.getTournament().getId());
    }

    // ── Get full War Room state (for initial page load) ──
    public AuctionDTO.WarRoomState getWarRoomState(Long tournamentId) {
        AuctionSession session = sessionRepo.findByTournamentId(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("No auction session found"));

        AuctionDTO.WarRoomState state = new AuctionDTO.WarRoomState();
        state.setAuctionStatus(session.getStatus().name());
        state.setCurrentHighestBid(session.getCurrentHighestBid());
        state.setCurrentHighestTeam(session.getCurrentHighestTeam() != null
                ? session.getCurrentHighestTeam().getName() : null);
        state.setTimerSeconds(session.getTimerSecondsRemaining());
        state.setTotalAuctionPot(session.getTotalAuctionPot());

        // Current player intro
        if (session.getCurrentPlayer() != null) {
            var currentEntry = queueRepo.findFirstBySessionIdAndStatusOrderByQueueOrder(
                    session.getId(), PlayerQueueStatus.BIDDING)
                    .or(() -> queueRepo.findFirstBySessionIdAndStatusOrderByQueueOrder(
                            session.getId(), PlayerQueueStatus.INTRO));
            currentEntry.ifPresent(e -> state.setCurrentPlayer(buildPlayerIntro(e)));
        }

        // Team budgets
        List<Team> teams = teamRepo.findByTournamentId(tournamentId);
        state.setTeamBudgets(teams.stream().map(t -> {
            AuctionDTO.TeamBudget tb = new AuctionDTO.TeamBudget();
            tb.setTeamId(t.getId());
            tb.setTeamName(t.getName());
            tb.setTeamIcon(t.getLogoIcon());
            tb.setBudgetRemaining(t.getBudgetRemaining());
            tb.setPlayersBought(t.getPlayersBought());
            tb.setPlayersNeeded(session.getTournament().getPlayersPerTeam() - t.getPlayersBought());
            return tb;
        }).collect(Collectors.toList()));

        // Sold players
        List<AuctionPlayerQueue> soldEntries = queueRepo.findBySessionIdAndStatus(
                session.getId(), PlayerQueueStatus.SOLD);
        state.setSoldPlayers(soldEntries.stream().map(e -> {
            AuctionDTO.SoldEvent se = new AuctionDTO.SoldEvent();
            se.setPlayerId(e.getPlayer().getId());
            se.setPlayerName(e.getPlayer().getUser() != null
                    ? e.getPlayer().getUser().getName() : "Player #" + e.getPlayer().getId());
            se.setTeamName(e.getSoldTeam().getName());
            se.setTeamId(e.getSoldTeam().getId());
            se.setSoldPrice(e.getSoldPrice());
            se.setTeamIcon(e.getSoldTeam().getLogoIcon());
            return se;
        }).collect(Collectors.toList()));

        // Upcoming players (next 3)
        List<AuctionPlayerQueue> upcoming = queueRepo.findTop3BySessionIdAndStatusOrderByQueueOrder(
                session.getId(), PlayerQueueStatus.PENDING);
        state.setUpcomingPlayers(upcoming.stream()
                .map(this::buildPlayerIntro)
                .collect(Collectors.toList()));

        // Recent bids
        List<AuctionBid> recentBids = bidRepo.findTop20BySessionIdOrderByBidTimeDesc(session.getId());
        state.setRecentBids(recentBids.stream().map(b -> {
            AuctionDTO.BidEvent be = new AuctionDTO.BidEvent();
            be.setTeamName(b.getTeam().getName());
            be.setTeamIcon(b.getTeam().getLogoIcon());
            be.setAmount(b.getAmount());
            be.setBidTime(b.getBidTime().format(TIME_FMT));
            return be;
        }).collect(Collectors.toList()));

        return state;
    }

    // ── Helpers ──

    public AuctionSession getSession(Long sessionId) {
        return sessionRepo.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Auction session not found"));
    }

    public AuctionSession getSessionByTournament(Long tournamentId) {
        return sessionRepo.findByTournamentId(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("No auction session found"));
    }

    private AuctionDTO.PlayerIntro buildPlayerIntro(AuctionPlayerQueue entry) {
        Player player = entry.getPlayer();
        AuctionDTO.PlayerIntro intro = new AuctionDTO.PlayerIntro();
        intro.setPlayerId(player.getId());
        intro.setPlayerName(player.getUser() != null ? player.getUser().getName() : "Player #" + player.getId());
        intro.setJerseyNumber(player.getJerseyNumber());
        intro.setPlayerRole(player.getPlayerRole() != null ? player.getPlayerRole().name() : "ALL_ROUNDER");
        intro.setBasePrice(entry.getBasePrice());
        intro.setAvatarIcon(player.getUser() != null ? player.getUser().getAvatarIcon() : null);
        intro.setTotalRuns(player.getTotalRuns());
        intro.setTotalWickets(player.getTotalWickets());
        intro.setTotalMatches(player.getTotalMatches());

        // Calculate batting average and strike rate
        if (player.getTotalMatches() != null && player.getTotalMatches() > 0) {
            intro.setBattingAverage((double) player.getTotalRuns() / player.getTotalMatches());
        }
        return intro;
    }
}
