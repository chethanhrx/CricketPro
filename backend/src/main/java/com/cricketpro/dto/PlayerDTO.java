package com.cricketpro.dto;

import com.cricketpro.model.enums.PlayerRole;
import lombok.Data;

public class PlayerDTO {

    @Data
    public static class PlayerResponse {
        private Long id;
        private Long userId;
        private String name;
        private String jerseyNumber;
        private String playerRole;
        private String battingStyle;
        private String bowlingStyle;
        private Integer totalMatches;
        private Integer totalRuns;
        private Integer totalWickets;
        private String avatarIcon;
    }
}
