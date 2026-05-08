package com.cricketpro.repository;

import com.cricketpro.model.AuctionBid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuctionBidRepository extends JpaRepository<AuctionBid, Long> {
    List<AuctionBid> findBySessionIdAndPlayerIdOrderByBidTimeDesc(Long sessionId, Long playerId);
    List<AuctionBid> findTop20BySessionIdOrderByBidTimeDesc(Long sessionId);
}
