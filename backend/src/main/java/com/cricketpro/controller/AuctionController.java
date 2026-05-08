package com.cricketpro.controller;

import com.cricketpro.dto.AuctionDTO;
import com.cricketpro.model.AuctionSession;
import com.cricketpro.model.User;
import com.cricketpro.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auction")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping("/{tournamentId}/create")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> createSession(@PathVariable Long tournamentId) {
        AuctionSession session = auctionService.createSession(tournamentId);
        return ResponseEntity.ok(Map.of(
                "sessionId", session.getId(),
                "status", session.getStatus().name(),
                "message", "Auction session created"
        ));
    }

    @PostMapping("/{tournamentId}/add-player")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> addPlayer(
            @PathVariable Long tournamentId,
            @RequestBody Map<String, Object> body) {
        AuctionSession session = auctionService.getSessionByTournament(tournamentId);
        Long playerId = ((Number) body.get("playerId")).longValue();
        Long basePrice = body.get("basePrice") != null ? ((Number) body.get("basePrice")).longValue() : 1000L;
        Integer order = body.get("order") != null ? ((Number) body.get("order")).intValue() : 0;

        auctionService.addPlayerToQueue(session.getId(), playerId, basePrice, order);
        return ResponseEntity.ok(Map.of("message", "Player added to auction queue"));
    }

    @PostMapping("/{tournamentId}/start")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> startAuction(@PathVariable Long tournamentId) {
        auctionService.startAuction(tournamentId);
        return ResponseEntity.ok(Map.of("message", "Auction started!"));
    }

    // Public endpoint — no auth needed (War Room)
    @GetMapping("/{tournamentId}/warroom")
    public ResponseEntity<AuctionDTO.WarRoomState> getWarRoom(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(auctionService.getWarRoomState(tournamentId));
    }

    // REST fallback for bidding (in case WebSocket fails)
    @PostMapping("/{tournamentId}/bid")
    @PreAuthorize("hasRole('TEAM_OWNER')")
    public ResponseEntity<AuctionDTO.BidEvent> placeBid(
            @PathVariable Long tournamentId,
            @RequestBody AuctionDTO.BidRequest request) {
        AuctionDTO.BidEvent event = auctionService.placeBid(
                tournamentId, request.getTeamId(), request.getAmount());
        return ResponseEntity.ok(event);
    }
}
