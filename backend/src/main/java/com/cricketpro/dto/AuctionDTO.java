package com.cricketpro.dto;

import lombok.Data;
import java.util.List;

public class AuctionDTO {

    @Data
    public static class BidRequest {
        private Long teamId;
        private Long amount;
    }

    @Data
    public static class BidEvent {
        private String teamName;
        private String teamIcon;
        private Long amount;
        private String bidTime;
        private String playerName;
        private boolean isHighest;
    }

    @Data
    public static class TimerUpdate {
        private Integer secondsRemaining;
        private Long currentBid;
        private String currentTeam;
    }

    @Data
    public static class SoldEvent {
        private String playerName;
        private Long playerId;
        private String teamName;
        private Long teamId;
        private Long soldPrice;
        private String teamIcon;
    }

    @Data
    public static class PlayerIntro {
        private Long playerId;
        private String playerName;
        private String jerseyNumber;
        private String playerRole;
        private Long basePrice;
        private Integer hypeScore;
        private String avatarIcon;
        // Career stats
        private Integer totalRuns;
        private Integer totalWickets;
        private Integer totalMatches;
        private Double battingAverage;
        private Double strikeRate;
    }

    @Data
    public static class WarRoomState {
        private String auctionStatus;
        private PlayerIntro currentPlayer;
        private Long currentHighestBid;
        private String currentHighestTeam;
        private Integer timerSeconds;
        private Long totalAuctionPot;
        private List<TeamBudget> teamBudgets;
        private List<SoldEvent> soldPlayers;
        private List<PlayerIntro> upcomingPlayers;
        private List<BidEvent> recentBids;
    }

    @Data
    public static class TeamBudget {
        private Long teamId;
        private String teamName;
        private String teamIcon;
        private Long budgetRemaining;
        private Integer playersBought;
        private Integer playersNeeded;
    }
}
