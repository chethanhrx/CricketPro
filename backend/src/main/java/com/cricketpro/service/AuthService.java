package com.cricketpro.service;

import com.cricketpro.dto.AuthDTO;
import com.cricketpro.model.User;
import com.cricketpro.repository.UserRepository;
import com.cricketpro.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .location(request.getLocation())
                .build();

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return new AuthDTO.AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole().name());
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return new AuthDTO.AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole().name());
    }

    public AuthDTO.UserProfile getProfile(User user) {
        AuthDTO.UserProfile profile = new AuthDTO.UserProfile();
        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setPhone(user.getPhone());
        profile.setRole(user.getRole().name());
        profile.setAvatarIcon(user.getAvatarIcon());
        profile.setLocation(user.getLocation());
        return profile;
    }
}
