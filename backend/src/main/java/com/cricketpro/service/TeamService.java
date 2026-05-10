package com.cricketpro.service;

import com.cricketpro.dto.TeamDTO;
import com.cricketpro.model.Team;
import com.cricketpro.model.Tournament;
import com.cricketpro.model.User;
import com.cricketpro.repository.TeamRepository;
import com.cricketpro.repository.TournamentRepository;
import com.cricketpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    public TeamDTO.TeamResponse createTeam(Long tournamentId, TeamDTO.CreateRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new IllegalArgumentException("Owner user not found"));

        if (teamRepository.existsByTournamentIdAndOwnerId(tournamentId, request.getOwnerId())) {
            throw new IllegalArgumentException("Owner already has a team in this tournament");
        }

        Team team = Team.builder()
                .name(request.getName())
                .logoIcon(request.getLogoIcon())
                .tournament(tournament)
                .owner(owner)
                .budgetRemaining(tournament.getBudgetPerTeam())
                .playersBought(0)
                .build();

        return toResponse(teamRepository.save(team));
    }

    public List<TeamDTO.TeamResponse> getTeamsByTournament(Long tournamentId) {
        return teamRepository.findByTournamentId(tournamentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TeamDTO.TeamResponse> getMyTeams(Long ownerId) {
        return teamRepository.findAll().stream()
                .filter(t -> t.getOwner().getId().equals(ownerId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TeamDTO.TeamResponse toResponse(Team team) {
        TeamDTO.TeamResponse res = new TeamDTO.TeamResponse();
        res.setId(team.getId());
        res.setName(team.getName());
        res.setLogoIcon(team.getLogoIcon() != null ? team.getLogoIcon() : "🏏");
        res.setOwnerId(team.getOwner().getId());
        res.setOwnerName(team.getOwner().getName());
        res.setBudgetRemaining(team.getBudgetRemaining());
        res.setPlayersBought(team.getPlayersBought());
        return res;
    }
}
