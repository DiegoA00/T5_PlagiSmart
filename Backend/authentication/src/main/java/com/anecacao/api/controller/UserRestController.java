package com.anecacao.api.controller;

import com.anecacao.api.data.dto.UserRegistrationRequestDTO;
import com.anecacao.api.data.dto.UserRegistrationResponseDTO;
import com.anecacao.api.domain.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserRestController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@RequestBody @Valid UserRegistrationRequestDTO user){
        return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
    }
}