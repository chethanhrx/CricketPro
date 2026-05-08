package com.cricketpro.model.enums;

public enum AuctionStatus {
    SETUP,        // Organizer adding players, configuring
    READY,        // All team owners joined, waiting to start
    ACTIVE,       // Auction is running
    PAUSED,       // Temporarily paused by organizer
    COMPLETED     // All players auctioned
}
