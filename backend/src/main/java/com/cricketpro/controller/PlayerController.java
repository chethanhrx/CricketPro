package com.cricketpro.controller;

import com.cricketpro.dto.PlayerDTO;
import com.cricketpro.dto.TournamentDTO;
import com.cricketpro.model.User;
import com.cricketpro.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    // Player registers themselves for a tournament
    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('PLAYER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> registerForTournament(
            @Valid @RequestBody TournamentDTO.PlayerRegisterRequest request,
            @AuthenticationPrincipal User user) {
        playerService.registerForTournament(user, request);
        return ResponseEntity.ok(Map.of("message", "Registered for tournament successfully"));
    }

    // Get all players in a tournament (for auction queue)
    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<PlayerDTO.PlayerResponse>> getPlayersByTournament(
            @PathVariable Long tournamentId) {
        return ResponseEntity.ok(playerService.getPlayersByTournament(tournamentId));
    }

    // Get my player profile
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PlayerDTO.PlayerResponse> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(playerService.getMyProfile(user));
    }

    // List all players (for organizer to add to auction)
    @GetMapping("/all")
    public ResponseEntity<List<PlayerDTO.PlayerResponse>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }
}
