package com.cricketpro.model.enums;

public enum PlayerQueueStatus {
    PENDING,    // Waiting in queue
    INTRO,      // Player intro being shown (10 seconds)
    BIDDING,    // Active bidding in progress
    SOLD,       // Sold to a team
    UNSOLD      // No bids, unsold
}
