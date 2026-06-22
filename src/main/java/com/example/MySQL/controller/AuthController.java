package com.example.MySQL.controller;

import com.example.MySQL.dto.UserLoginDto;
import com.example.MySQL.dto.UserRegisterDto;
import com.example.MySQL.entity.User;
import com.example.MySQL.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegisterDto dto) {
        User registeredUser = userService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully with ID: " + registeredUser.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserLoginDto dto) {
        User loggedInUser = userService.loginUser(dto);
        return ResponseEntity.ok("Login successful for user: " + loggedInUser.getName());
    }
}
