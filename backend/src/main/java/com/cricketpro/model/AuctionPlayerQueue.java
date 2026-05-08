package com.cricketpro.model;

import com.cricketpro.model.enums.PlayerQueueStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auction_player_queue", indexes = {
    @Index(name = "idx_queue_session_order", columnList = "session_id, queueOrder")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuctionPlayerQueue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private AuctionSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(nullable = false)
    private Integer queueOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private PlayerQueueStatus status = PlayerQueueStatus.PENDING;

    private Long soldPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sold_team_id")
    private Team soldTeam;

    @Column(nullable = false)
    @Builder.Default
    private Long basePrice = 1000L;
}
