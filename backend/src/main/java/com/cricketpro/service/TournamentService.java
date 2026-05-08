package com.cricketpro.service;

import com.cricketpro.dto.TournamentDTO;
import com.cricketpro.model.Tournament;
import com.cricketpro.model.User;
import com.cricketpro.model.enums.TournamentStatus;
import com.cricketpro.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public Tournament create(TournamentDTO.CreateRequest request, User organizer) {
        Tournament tournament = Tournament.builder()
                .name(request.getName())
                .organizer(organizer)
                .location(request.getLocation())
                .description(request.getDescription())
                .teamCount(request.getTeamCount() != null ? request.getTeamCount() : 8)
                .playersPerTeam(request.getPlayersPerTeam() != null ? request.getPlayersPerTeam() : 11)
                .budgetPerTeam(request.getBudgetPerTeam() != null ? request.getBudgetPerTeam() : 50000L)
                .teamOwnershipFee(request.getTeamOwnershipFee() != null ? request.getTeamOwnershipFee() : 5000L)
                .bidTimerSeconds(request.getBidTimerSeconds() != null ? request.getBidTimerSeconds() : 15)
                .minBidIncrement(request.getMinBidIncrement() != null ? request.getMinBidIncrement() : 100L)
                .oversPerMatch(request.getOversPerMatch() != null ? request.getOversPerMatch() : 20)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(TournamentStatus.DRAFT)
                .build();

        return tournamentRepository.save(tournament);
    }

    public Tournament getById(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
    }

    public Tournament getBySlug(String slug) {
        return tournamentRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
    }

    public List<Tournament> getPublicTournaments() {
        return tournamentRepository.findByStatusIn(List.of(
                TournamentStatus.REGISTRATION_OPEN,
                TournamentStatus.AUCTION_PHASE,
                TournamentStatus.IN_PROGRESS,
                TournamentStatus.COMPLETED
        ));
    }

    public List<Tournament> getByOrganizer(Long organizerId) {
        return tournamentRepository.findByOrganizerId(organizerId);
    }

    public Tournament updateStatus(Long id, TournamentStatus status) {
        Tournament tournament = getById(id);
        tournament.setStatus(status);
        return tournamentRepository.save(tournament);
    }

    public TournamentDTO.PublicView toPublicView(Tournament t) {
        TournamentDTO.PublicView view = new TournamentDTO.PublicView();
        view.setId(t.getId());
        view.setName(t.getName());
        view.setSlug(t.getSlug());
        view.setLocation(t.getLocation());
        view.setDescription(t.getDescription());
        view.setStatus(t.getStatus().name());
        view.setTeamCount(t.getTeamCount());
        view.setPlayersPerTeam(t.getPlayersPerTeam());
        view.setBudgetPerTeam(t.getBudgetPerTeam());
        view.setTeamOwnershipFee(t.getTeamOwnershipFee());
        view.setOversPerMatch(t.getOversPerMatch());
        view.setOrganizerName(t.getOrganizer().getName());
        view.setStartDate(t.getStartDate());
        view.setEndDate(t.getEndDate());
        return view;
    }
}
