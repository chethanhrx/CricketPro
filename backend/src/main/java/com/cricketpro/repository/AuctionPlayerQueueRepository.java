package com.cricketpro.repository;

import com.cricketpro.model.AuctionPlayerQueue;
import com.cricketpro.model.enums.PlayerQueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AuctionPlayerQueueRepository extends JpaRepository<AuctionPlayerQueue, Long> {
    List<AuctionPlayerQueue> findBySessionIdOrderByQueueOrder(Long sessionId);

    Optional<AuctionPlayerQueue> findFirstBySessionIdAndStatusOrderByQueueOrder(
            Long sessionId, PlayerQueueStatus status);

    List<AuctionPlayerQueue> findTop3BySessionIdAndStatusOrderByQueueOrder(
            Long sessionId, PlayerQueueStatus status);

    List<AuctionPlayerQueue> findBySessionIdAndStatus(Long sessionId, PlayerQueueStatus status);
}
