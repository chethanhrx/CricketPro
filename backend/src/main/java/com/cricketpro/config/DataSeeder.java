package com.cricketpro.config;

import com.cricketpro.model.User;
import com.cricketpro.model.enums.Role;
import com.cricketpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds default accounts on first startup.
 * These are created only if they don't already exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Admin account
        createUserIfNotExists(
            "Chethan", "admin@cricketpro.in", "admin123",
            Role.ADMIN, "Bangalore"
        );

        // Demo Organizer
        createUserIfNotExists(
            "Organizer Demo", "organizer@cricketpro.in", "organizer123",
            Role.ORGANIZER, "Bangalore"
        );

        // Demo Team Owners
        createUserIfNotExists(
            "Owner Royal Kings", "owner1@cricketpro.in", "owner123",
            Role.TEAM_OWNER, "Kolar"
        );
        createUserIfNotExists(
            "Owner Thunder XI", "owner2@cricketpro.in", "owner123",
            Role.TEAM_OWNER, "Nelamangala"
        );

        // Demo Players
        createUserIfNotExists(
            "Manjunath R", "player1@cricketpro.in", "player123",
            Role.PLAYER, "Yelahanka"
        );
        createUserIfNotExists(
            "Rahul S", "player2@cricketpro.in", "player123",
            Role.PLAYER, "Tumkur"
        );

        // Demo Scorer
        createUserIfNotExists(
            "Scorer Demo", "scorer@cricketpro.in", "scorer123",
            Role.SCORER, "Bangalore"
        );

        log.info("🏏 CricketPro data seeding complete!");
    }

    private void createUserIfNotExists(String name, String email, String password, Role role, String location) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(role)
                    .location(location)
                    .build();
            userRepository.save(user);
            log.info("   ✓ Created {} — {} ({})", role, name, email);
        }
    }
}
