package com.cricketpro.repository;

import com.cricketpro.model.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {
    List<PlayerStats> findByTournamentId(Long tournamentId);
    Optional<PlayerStats> findByPlayerIdAndTournamentId(Long playerId, Long tournamentId);
    List<PlayerStats> findByPlayerId(Long playerId);
}
