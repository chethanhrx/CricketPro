package com.cricketpro.model;

import com.cricketpro.model.enums.WicketType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries", indexes = {
    @Index(name = "idx_delivery_innings", columnList = "innings_id, overNumber, ballNumber")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "innings_id", nullable = false)
    private Innings innings;

    @Column(nullable = false)
    private Integer overNumber;

    @Column(nullable = false)
    private Integer ballNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batsman_id", nullable = false)
    private Player batsman;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bowler_id", nullable = false)
    private Player bowler;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "non_striker_id")
    private Player nonStriker;

    @Column(nullable = false)
    @Builder.Default
    private Integer runsOffBat = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer extraRuns = 0;

    @Column(length = 15)
    private String extrasType; // WIDE, NO_BALL, BYE, LEG_BYE

    @Column(nullable = false)
    @Builder.Default
    private Boolean isWicket = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private WicketType wicketType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fielder_id")
    private Player fielder;

    @Column(length = 500)
    private String commentaryText;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isLegal = true; // false for wides, no-balls

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
