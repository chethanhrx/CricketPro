package com.cricketpro.controller;

import com.cricketpro.dto.AuctionDTO;
import com.cricketpro.service.AuctionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AuctionWebSocketController {

    private final AuctionService auctionService;

    /**
     * Team owners send bids here via WebSocket.
     * Client sends to: /app/auction/{tournamentId}/bid
     * Payload: { teamId: 1, amount: 5000 }
     */
    @MessageMapping("/auction/{tournamentId}/bid")
    public void handleBid(
            @DestinationVariable Long tournamentId,
            @Payload AuctionDTO.BidRequest bidRequest) {
        try {
            auctionService.placeBid(tournamentId, bidRequest.getTeamId(), bidRequest.getAmount());
        } catch (Exception e) {
            log.error("Bid failed for tournament {}: {}", tournamentId, e.getMessage());
            // Error handling — could send error back to specific user
        }
    }
}
