package com.cricketpro.repository;

import com.cricketpro.model.AuctionSession;
import com.cricketpro.model.enums.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {
    Optional<AuctionSession> findByTournamentId(Long tournamentId);
    List<AuctionSession> findByStatus(AuctionStatus status);
}
