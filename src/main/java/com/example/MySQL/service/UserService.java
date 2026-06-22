package com.example.MySQL.service;

import com.example.MySQL.dto.UserLoginDto;
import com.example.MySQL.dto.UserRegisterDto;
import com.example.MySQL.entity.User;

public interface UserService {
    User registerUser(UserRegisterDto dto);
    User loginUser(UserLoginDto dto);
}
