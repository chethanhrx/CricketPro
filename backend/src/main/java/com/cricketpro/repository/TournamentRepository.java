package com.cricketpro.repository;

import com.cricketpro.model.Tournament;
import com.cricketpro.model.enums.TournamentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByStatusIn(List<TournamentStatus> statuses);
    Optional<Tournament> findBySlug(String slug);
    List<Tournament> findByOrganizerId(Long organizerId);
}
