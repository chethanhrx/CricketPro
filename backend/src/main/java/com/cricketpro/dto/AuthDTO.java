package com.cricketpro.dto;

import com.cricketpro.model.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class RegisterRequest {
        @NotBlank private String name;
        @Email @NotBlank private String email;
        @Size(min = 6) @NotBlank private String password;
        private String phone;
        @NotNull private Role role;
        private String location;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String name;
        private String email;
        private String role;

        public AuthResponse(String token, Long userId, String name, String email, String role) {
            this.token = token;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.role = role;
        }
    }

    @Data
    public static class UserProfile {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String avatarIcon;
        private String location;
    }
}
