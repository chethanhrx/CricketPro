package com.cricketpro.dto;

import com.cricketpro.model.enums.PlayerRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

public class TournamentDTO {

    @Data
    public static class CreateRequest {
        @NotBlank private String name;
        private String location;
        private String description;
        private Integer teamCount;
        private Integer playersPerTeam;
        private Long budgetPerTeam;
        private Long teamOwnershipFee;
        private Integer bidTimerSeconds;
        private Long minBidIncrement;
        private Integer oversPerMatch;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    @Data
    public static class PublicView {
        private Long id;
        private String name;
        private String slug;
        private String location;
        private String description;
        private String status;
        private Integer teamCount;
        private Integer playersPerTeam;
        private Long budgetPerTeam;
        private Long teamOwnershipFee;
        private Integer oversPerMatch;
        private String organizerName;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    @Data
    public static class PlayerRegisterRequest {
        @NotNull private Long tournamentId;
        private String jerseyNumber;
        @NotNull private PlayerRole playerRole;
        private String battingStyle;
        private String bowlingStyle;
        private Long basePrice;
    }
}
