package com.cricketpro.model;

import com.cricketpro.model.enums.AuctionStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "auction_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuctionSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false, unique = true)
    private Tournament tournament;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AuctionStatus status = AuctionStatus.SETUP;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_player_id")
    private Player currentPlayer;

    @Builder.Default
    private Long currentHighestBid = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_highest_team_id")
    private Team currentHighestTeam;

    @Column(nullable = false)
    @Builder.Default
    private Integer timerSecondsRemaining = 15;

    @Column(nullable = false)
    @Builder.Default
    private Long totalAuctionPot = 0L; // Total money spent so far

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
