package com.example.MySQL.service.impl;

import com.example.MySQL.dto.UserLoginDto;
import com.example.MySQL.dto.UserRegisterDto;
import com.example.MySQL.entity.User;
import com.example.MySQL.exception.InvalidCredentialsException;
import com.example.MySQL.exception.UserAlreadyExistsException;
import com.example.MySQL.exception.UserNotFoundException;
import com.example.MySQL.repository.UserRepository;
import com.example.MySQL.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(UserRegisterDto dto) {
        log.info("User Activity: Registration attempt for email: {}", dto.getEmail());

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            log.warn("User Activity: Registration failed. Email already exists: {}", dto.getEmail());
            throw new UserAlreadyExistsException("User already exist");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        User savedUser = userRepository.save(user);
        log.info("User Activity: Registration successful for email: {}, assigned ID: {}", savedUser.getEmail(), savedUser.getId());
        return savedUser;
    }

    @Override
    public User loginUser(UserLoginDto dto) {
        log.info("User Activity: Login attempt for email: {}", dto.getEmail());

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> {
                    log.warn("User Activity: Login failed. Email not found: {}", dto.getEmail());
                    return new UserNotFoundException("user not found , Please register");
                });

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            log.warn("User Activity: Login failed. Incorrect password for email: {}", dto.getEmail());
            throw new InvalidCredentialsException("Invalid credentials");
        }

        log.info("User Activity: Login successful for email: {}", dto.getEmail());
        return user;
    }
}
