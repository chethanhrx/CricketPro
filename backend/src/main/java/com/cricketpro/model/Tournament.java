package com.cricketpro.model;

import com.cricketpro.model.enums.TournamentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tournaments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 50)
    private String slug; // URL-friendly: kolar-cup-2025

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @Column(length = 300)
    private String location;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    @Builder.Default
    private TournamentStatus status = TournamentStatus.DRAFT;

    @Column(nullable = false)
    @Builder.Default
    private Integer teamCount = 8;

    @Column(nullable = false)
    @Builder.Default
    private Integer playersPerTeam = 11;

    @Column(nullable = false)
    @Builder.Default
    private Long budgetPerTeam = 50000L; // ₹50,000

    @Column(nullable = false)
    @Builder.Default
    private Long teamOwnershipFee = 5000L; // ₹5,000

    @Column(nullable = false)
    @Builder.Default
    private Integer bidTimerSeconds = 15;

    @Column(nullable = false)
    @Builder.Default
    private Long minBidIncrement = 100L; // ₹100

    @Column(nullable = false)
    @Builder.Default
    private Integer oversPerMatch = 20; // T20

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (slug == null && name != null) {
            slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-")
                       .replaceAll("^-|-$", "");
        }
    }
}
