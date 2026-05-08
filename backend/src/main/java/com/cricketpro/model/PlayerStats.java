package com.cricketpro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "player_tournament_stats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"player_id", "tournament_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlayerStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    // Batting stats
    @Builder.Default private Integer matches = 0;
    @Builder.Default private Integer innings = 0;
    @Builder.Default private Integer runs = 0;
    @Builder.Default private Integer ballsFaced = 0;
    @Builder.Default private Integer fours = 0;
    @Builder.Default private Integer sixes = 0;
    @Builder.Default private Integer highestScore = 0;
    @Builder.Default private Integer notOuts = 0;

    // Bowling stats
    @Builder.Default private Integer oversBowled = 0;
    @Builder.Default private Integer ballsBowled = 0;
    @Builder.Default private Integer wickets = 0;
    @Builder.Default private Integer runsConceded = 0;
    @Builder.Default private Integer maidens = 0;

    // Fielding stats
    @Builder.Default private Integer catches = 0;
    @Builder.Default private Integer runOuts = 0;
    @Builder.Default private Integer stumpings = 0;

    // Awards
    @Builder.Default private Integer motmCount = 0;

    // Calculated Hype Score (0-100)
    @Builder.Default private Integer hypeScore = 0;
}
