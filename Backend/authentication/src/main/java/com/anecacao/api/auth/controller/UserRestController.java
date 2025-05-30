package com.anecacao.api.auth.controller;

import com.anecacao.api.auth.data.dto.*;
import com.anecacao.api.auth.domain.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserRestController {
    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@RequestBody @Valid UserRegistrationRequestDTO user){
        return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/auth/login")
    public UserLoginResponseDTO login (@RequestBody @Valid UserLoginRequestDTO userLoginRequestDTO){
        return userService.loginUser(userLoginRequestDTO);
    }

    @GetMapping ("/users")
    public UserDTO getUserInfo () {
        return userService.getUserInfo();
    }
}