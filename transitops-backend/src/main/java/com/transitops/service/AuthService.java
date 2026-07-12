package com.transitops.service;

import com.transitops.dto.AuthDto.*;
import com.transitops.entity.User;
import com.transitops.enums.RoleName;
import com.transitops.repository.UserRepository;
import com.transitops.security.JwtUtil;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostConstruct
    public void seedDefaultUsers() {
        if (userRepository.count() == 0) {
            createUser("admin@transitops.com", "admin123", "Admin", RoleName.FLEET_MANAGER);
            createUser("driver@transitops.com", "driver123", "Driver User", RoleName.DRIVER);
            createUser("safety@transitops.com", "safety123", "Safety Officer", RoleName.SAFETY_OFFICER);
            createUser("finance@transitops.com", "finance123", "Financial Analyst", RoleName.FINANCIAL_ANALYST);
        }
    }

    private void createUser(String email, String password, String name, RoleName role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setRole(role);
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        createUser(request.getEmail(), request.getPassword(), request.getName(), request.getRole());
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole().name());
    }
}
