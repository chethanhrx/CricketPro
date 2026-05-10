package com.cricketpro.config;

import com.cricketpro.model.*;
import com.cricketpro.model.enums.*;
import com.cricketpro.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds default accounts and mock auction data on first startup.
 * These are created only if they don't already exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final AuctionSessionRepository auctionSessionRepository;
    private final AuctionPlayerQueueRepository auctionPlayerQueueRepository;
    private final AuctionBidRepository auctionBidRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Admin account
        User admin = createUserIfNotExists("Chethan", "admin@cricketpro.in", "admin123", Role.ADMIN, "Bangalore");
        // Demo Organizer
        User organizer = createUserIfNotExists("Organizer Demo", "organizer@cricketpro.in", "organizer123", Role.ORGANIZER, "Bangalore");
        // Demo Team Owners
        User owner1 = createUserIfNotExists("Owner Royal Kings", "owner1@cricketpro.in", "owner123", Role.TEAM_OWNER, "Kolar");
        User owner2 = createUserIfNotExists("Owner Thunder XI", "owner2@cricketpro.in", "owner123", Role.TEAM_OWNER, "Nelamangala");
        // Demo Players
        User playerUser1 = createUserIfNotExists("Manjunath H R", "player1@cricketpro.in", "player123", Role.PLAYER, "Yelahanka");
        User playerUser2 = createUserIfNotExists("Rahul S", "player2@cricketpro.in", "player123", Role.PLAYER, "Tumkur");
        // Demo Scorer
        User scorer = createUserIfNotExists("Scorer Demo", "scorer@cricketpro.in", "scorer123", Role.SCORER, "Bangalore");

        seedAuctionData(organizer, owner1, owner2, playerUser1, playerUser2);

        log.info("🏏 CricketPro data seeding complete!");
    }

    private User createUserIfNotExists(String name, String email, String password, Role role, String location) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .location(location)
                    .build();
            user = userRepository.save(user);
            log.info("   ✓ Created {} — {} ({})", role, name, email);
            return user;
        });
    }

    private void seedAuctionData(User organizer, User owner1, User owner2, User p1, User p2) {
        if (tournamentRepository.count() > 0) {
            log.info("   🧹 Clearing existing mock data...");
            auctionPlayerQueueRepository.deleteAll();
            auctionBidRepository.deleteAll();
            auctionSessionRepository.deleteAll();
            teamRepository.deleteAll();
            tournamentRepository.deleteAll();
        }

        log.info("   ⏳ Seeding mock tournament and auction data...");

        // 1. Tournament
        Tournament tournament = Tournament.builder()
                .name("Kolar Premium League 2026")
                .organizer(organizer)
                .location("Kolar District Grounds, Karnataka")
                .status(TournamentStatus.AUCTION_PHASE)
                .teamCount(4)
                .build();
        tournament = tournamentRepository.save(tournament);

        // 2. Teams
        Team team1 = Team.builder().name("Royal Kings").tournament(tournament).owner(owner1).logoIcon("👑").build();
        Team team2 = Team.builder().name("Thunder XI").tournament(tournament).owner(owner2).logoIcon("⚡").build();
        teamRepository.save(team1);
        teamRepository.save(team2);

        // 3. Auction Session
        AuctionSession session = AuctionSession.builder()
                .tournament(tournament)
                .status(AuctionStatus.ACTIVE)
                .build();
        session = auctionSessionRepository.save(session);

        // 4. Players & Queue (55 players)
        String[] firstNames = {"Virat", "Rohit", "MS", "Jasprit", "Ravindra", "Hardik", "KL", "Shikhar", "Rishabh", "Shreyas", "Suryakumar", "Mohammed", "Yuzvendra", "Kuldeep", "Bhuvneshwar", "Ashwin", "Pujara", "Rahane", "Mayank", "Shubman", "Ishan", "Sanju", "Deepak", "Shardul", "Axar"};
        String[] lastNames = {"Kohli", "Sharma", "Dhoni", "Bumrah", "Jadeja", "Pandya", "Rahul", "Dhawan", "Pant", "Iyer", "Yadav", "Shami", "Chahal", "Siraj", "Kumar", "Ashwin", "Pujara", "Rahane", "Agarwal", "Gill", "Kishan", "Samson", "Chahar", "Thakur", "Patel"};
        
        Player activePlayer = null;

        for (int i = 1; i <= 55; i++) {
            User u;
            if (i == 1) u = p1;
            else if (i == 2) u = p2;
            else {
                String name = firstNames[i % firstNames.length] + " " + lastNames[(i * 3) % lastNames.length] + " " + i;
                u = createUserIfNotExists(name, "player" + i + "@demo.com", "player123", Role.PLAYER, "Bangalore");
            }

            PlayerRole[] roles = PlayerRole.values();
            PlayerRole pRole = roles[i % roles.length];
            
            final int index = i;
            Player p = playerRepository.findByUserId(u.getId()).orElseGet(() -> 
                Player.builder()
                    .user(u)
                    .playerRole(pRole)
                    .battingStyle(index % 2 == 0 ? "RIGHT_HAND" : "LEFT_HAND")
                    .bowlingStyle(pRole == PlayerRole.BOWLER ? "FAST" : null)
                    .totalRuns(100 + (index * 45) % 3000)
                    .totalWickets(pRole == PlayerRole.BOWLER || pRole == PlayerRole.ALL_ROUNDER ? (index * 7) % 200 : 0)
                    .totalMatches(10 + (index * 3) % 150)
                    .jerseyNumber(String.valueOf(index))
                    .build()
            );
            p = playerRepository.save(p);

            PlayerQueueStatus status = (i == 1) ? PlayerQueueStatus.BIDDING : PlayerQueueStatus.PENDING;
            long basePrice = 1000L + ((i % 10) * 500L);
            
            AuctionPlayerQueue q = AuctionPlayerQueue.builder()
                .session(session)
                .player(p)
                .queueOrder(i)
                .basePrice(basePrice)
                .status(status)
                .build();
            auctionPlayerQueueRepository.save(q);

            if (i == 1) activePlayer = p;
        }

        // Update Session with active player
        session.setCurrentPlayer(activePlayer);
        auctionSessionRepository.save(session);

        log.info("   ✓ Mock tournament & auction session created successfully with 55 players.");
    }
}
