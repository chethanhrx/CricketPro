package com.cricketpro.service;

import com.cricketpro.dto.PlayerDTO;
import com.cricketpro.dto.TournamentDTO;
import com.cricketpro.model.Player;
import com.cricketpro.model.PlayerStats;
import com.cricketpro.model.Tournament;
import com.cricketpro.model.User;
import com.cricketpro.repository.PlayerRepository;
import com.cricketpro.repository.PlayerStatsRepository;
import com.cricketpro.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final TournamentRepository tournamentRepository;
    private final PlayerStatsRepository playerStatsRepository;

    @Transactional
    public void registerForTournament(User user, TournamentDTO.PlayerRegisterRequest request) {
        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        // Get or create player profile
        Player player = playerRepository.findByUserId(user.getId()).orElseGet(() -> {
            Player p = Player.builder()
                    .user(user)
                    .jerseyNumber(request.getJerseyNumber())
                    .playerRole(request.getPlayerRole())
                    .battingStyle(request.getBattingStyle())
                    .bowlingStyle(request.getBowlingStyle())
                    .build();
            return playerRepository.save(p);
        });

        // Update details if provided
        if (request.getJerseyNumber() != null) player.setJerseyNumber(request.getJerseyNumber());
        if (request.getPlayerRole() != null) player.setPlayerRole(request.getPlayerRole());
        if (request.getBattingStyle() != null) player.setBattingStyle(request.getBattingStyle());
        if (request.getBowlingStyle() != null) player.setBowlingStyle(request.getBowlingStyle());
        playerRepository.save(player);

        // Check if already registered
        if (playerStatsRepository.findByPlayerIdAndTournamentId(player.getId(), tournament.getId()).isPresent()) {
            throw new IllegalArgumentException("Already registered for this tournament");
        }

        // Create PlayerStats entry = tournament registration
        PlayerStats stats = PlayerStats.builder()
                .player(player)
                .tournament(tournament)
                .hypeScore(50)
                .build();
        playerStatsRepository.save(stats);
    }

    public List<PlayerDTO.PlayerResponse> getPlayersByTournament(Long tournamentId) {
        return playerStatsRepository.findByTournamentId(tournamentId)
                .stream()
                .map(stats -> toResponse(stats.getPlayer()))
                .collect(Collectors.toList());
    }

    public PlayerDTO.PlayerResponse getMyProfile(User user) {
        Player player = playerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Player profile not found. Please register for a tournament first."));
        return toResponse(player);
    }

    public List<PlayerDTO.PlayerResponse> getAllPlayers() {
        return playerRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PlayerDTO.PlayerResponse toResponse(Player player) {
        PlayerDTO.PlayerResponse res = new PlayerDTO.PlayerResponse();
        res.setId(player.getId());
        res.setUserId(player.getUser().getId());
        res.setName(player.getUser().getName());
        res.setJerseyNumber(player.getJerseyNumber() != null ? player.getJerseyNumber() : "-");
        res.setPlayerRole(player.getPlayerRole() != null ? player.getPlayerRole().name() : "ALL_ROUNDER");
        res.setBattingStyle(player.getBattingStyle());
        res.setBowlingStyle(player.getBowlingStyle());
        res.setTotalMatches(player.getTotalMatches() != null ? player.getTotalMatches() : 0);
        res.setTotalRuns(player.getTotalRuns() != null ? player.getTotalRuns() : 0);
        res.setTotalWickets(player.getTotalWickets() != null ? player.getTotalWickets() : 0);
        res.setAvatarIcon(player.getUser().getAvatarIcon());
        return res;
    }
}
