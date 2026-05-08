package com.cricketpro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "innings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Innings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @Column(nullable = false)
    private Integer inningsNumber; // 1 or 2

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batting_team_id", nullable = false)
    private Team battingTeam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bowling_team_id", nullable = false)
    private Team bowlingTeam;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalRuns = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalWickets = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalBalls = 0; // balls bowled (legal deliveries)

    @Column(nullable = false)
    @Builder.Default
    private Integer extras = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;
}
