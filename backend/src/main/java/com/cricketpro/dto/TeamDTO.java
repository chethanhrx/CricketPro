package com.cricketpro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class TeamDTO {

    @Data
    public static class CreateRequest {
        @NotBlank private String name;
        private String logoIcon;
        @NotNull private Long ownerId;
    }

    @Data
    public static class TeamResponse {
        private Long id;
        private String name;
        private String logoIcon;
        private Long ownerId;
        private String ownerName;
        private Long budgetRemaining;
        private Integer playersBought;
    }
}
