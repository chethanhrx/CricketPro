package com.cricketpro.controller;

import com.cricketpro.dto.TeamDTO;
import com.cricketpro.model.User;
import com.cricketpro.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping("/{tournamentId}/create")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> createTeam(
            @PathVariable Long tournamentId,
            @Valid @RequestBody TeamDTO.CreateRequest request) {
        TeamDTO.TeamResponse team = teamService.createTeam(tournamentId, request);
        return ResponseEntity.ok(Map.of("message", "Team created successfully", "team", team));
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<TeamDTO.TeamResponse>> getTeamsByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(teamService.getTeamsByTournament(tournamentId));
    }

    @GetMapping("/my-teams")
    @PreAuthorize("hasAnyRole('TEAM_OWNER', 'ADMIN')")
    public ResponseEntity<List<TeamDTO.TeamResponse>> getMyTeams(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(teamService.getMyTeams(user.getId()));
    }
}
