package com.cricketpro.model;

import com.cricketpro.model.enums.PlayerRole;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "players")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 5)
    private String jerseyNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PlayerRole playerRole;

    @Column(length = 200)
    private String location;

    @Column(length = 50)
    private String battingStyle; // RIGHT_HAND, LEFT_HAND

    @Column(length = 50)
    private String bowlingStyle; // FAST, MEDIUM, SPIN, etc.

    // Career aggregates (updated after each tournament)
    @Column(nullable = false)
    @Builder.Default
    private Integer totalMatches = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalRuns = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalWickets = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalCatches = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer motmCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
