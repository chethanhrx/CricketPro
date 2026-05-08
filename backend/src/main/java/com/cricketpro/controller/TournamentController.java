package com.cricketpro.controller;

import com.cricketpro.dto.TournamentDTO;
import com.cricketpro.model.Tournament;
import com.cricketpro.model.User;
import com.cricketpro.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<TournamentDTO.PublicView> create(
            @Valid @RequestBody TournamentDTO.CreateRequest request,
            @AuthenticationPrincipal User user) {
        Tournament tournament = tournamentService.create(request, user);
        return ResponseEntity.ok(tournamentService.toPublicView(tournament));
    }

    @GetMapping("/public")
    public ResponseEntity<List<TournamentDTO.PublicView>> listPublic() {
        List<TournamentDTO.PublicView> tournaments = tournamentService.getPublicTournaments()
                .stream()
                .map(tournamentService::toPublicView)
                .toList();
        return ResponseEntity.ok(tournaments);
    }

    @GetMapping("/{id}/public")
    public ResponseEntity<TournamentDTO.PublicView> getPublic(@PathVariable Long id) {
        Tournament tournament = tournamentService.getById(id);
        return ResponseEntity.ok(tournamentService.toPublicView(tournament));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<TournamentDTO.PublicView> getBySlug(@PathVariable String slug) {
        Tournament tournament = tournamentService.getBySlug(slug);
        return ResponseEntity.ok(tournamentService.toPublicView(tournament));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<List<TournamentDTO.PublicView>> myTournaments(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                tournamentService.getByOrganizer(user.getId())
                        .stream()
                        .map(tournamentService::toPublicView)
                        .toList()
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Map<String, String>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        var status = com.cricketpro.model.enums.TournamentStatus.valueOf(body.get("status"));
        tournamentService.updateStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status updated to " + status));
    }
}
