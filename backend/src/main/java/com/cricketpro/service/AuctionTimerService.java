package com.cricketpro.service;

import com.cricketpro.dto.AuctionDTO;
import com.cricketpro.model.AuctionPlayerQueue;
import com.cricketpro.model.AuctionSession;
import com.cricketpro.model.enums.AuctionStatus;
import com.cricketpro.model.enums.PlayerQueueStatus;
import com.cricketpro.repository.AuctionPlayerQueueRepository;
import com.cricketpro.repository.AuctionSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuctionTimerService {

    private final AuctionSessionRepository sessionRepo;
    private final AuctionPlayerQueueRepository queueRepo;
    private final AuctionService auctionService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Ticks every second for all active auctions.
     * Handles: timer countdown, INTRO → BIDDING transition, auto-SOLD/UNSOLD.
     */
    @Scheduled(fixedRate = 1000)
    @Transactional
    public void tickAuctionTimer() {
        List<AuctionSession> activeSessions = sessionRepo.findByStatus(AuctionStatus.ACTIVE);

        for (AuctionSession session : activeSessions) {
            Long tournamentId = session.getTournament().getId();

            // Check if we have a player in INTRO state
            var introEntry = queueRepo.findFirstBySessionIdAndStatusOrderByQueueOrder(
                    session.getId(), PlayerQueueStatus.INTRO);

            if (introEntry.isPresent()) {
                // Count down intro timer (using session timer)
                int remaining = session.getTimerSecondsRemaining() - 1;

                if (remaining <= (session.getTournament().getBidTimerSeconds() - 10)) {
                    // Intro period over (10 seconds), transition to BIDDING
                    AuctionPlayerQueue entry = introEntry.get();
                    entry.setStatus(PlayerQueueStatus.BIDDING);
                    queueRepo.save(entry);

                    session.setTimerSecondsRemaining(session.getTournament().getBidTimerSeconds());
                    session.setCurrentHighestBid(0L);
                    session.setCurrentHighestTeam(null);
                    sessionRepo.save(session);

                    messagingTemplate.convertAndSend(
                            "/topic/auction/" + tournamentId,
                            java.util.Map.of("type", "BIDDING_START",
                                    "basePrice", entry.getBasePrice(),
                                    "timerSeconds", session.getTournament().getBidTimerSeconds()));

                    log.info("⏱️ BIDDING START for player {} in tournament {}",
                            entry.getPlayer().getId(), tournamentId);
                } else {
                    session.setTimerSecondsRemaining(remaining);
                    sessionRepo.save(session);

                    // Broadcast intro countdown
                    messagingTemplate.convertAndSend(
                            "/topic/auction/" + tournamentId,
                            java.util.Map.of("type", "INTRO_TIMER", "seconds", remaining));
                }
                continue;
            }

            // Check if we have a player in BIDDING state
            var biddingEntry = queueRepo.findFirstBySessionIdAndStatusOrderByQueueOrder(
                    session.getId(), PlayerQueueStatus.BIDDING);

            if (biddingEntry.isPresent()) {
                int remaining = session.getTimerSecondsRemaining() - 1;

                if (remaining <= 0) {
                    // Timer expired — process SOLD or UNSOLD
                    auctionService.processSold(session);
                    log.info("⏰ Timer expired for auction {}", tournamentId);
                } else {
                    session.setTimerSecondsRemaining(remaining);
                    sessionRepo.save(session);

                    // Broadcast timer tick
                    AuctionDTO.TimerUpdate update = new AuctionDTO.TimerUpdate();
                    update.setSecondsRemaining(remaining);
                    update.setCurrentBid(session.getCurrentHighestBid());
                    update.setCurrentTeam(session.getCurrentHighestTeam() != null
                            ? session.getCurrentHighestTeam().getName() : null);

                    messagingTemplate.convertAndSend(
                            "/topic/auction/" + tournamentId, update);
                }
            }
        }
    }
}
