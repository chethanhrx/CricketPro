package com.cricketpro.repository;

import com.cricketpro.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByTournamentId(Long tournamentId);
    Optional<Team> findByTournamentIdAndOwnerId(Long tournamentId, Long ownerId);
    boolean existsByTournamentIdAndOwnerId(Long tournamentId, Long ownerId);
}
