package com.anecacao.api.auth.controller;

import com.anecacao.api.auth.data.dto.*;
import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.auth.domain.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserRestController {
    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(
            @RequestBody @Valid UserRegistrationRequestDTO user){
        return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
    }

    @PostMapping("/auth/profile-setup")
    public void completeUserInfo(
            @RequestBody @Valid UserProfileSetUpRequestDTO user){
        userService.completeUserInfo(user);
    }

    @PostMapping("/auth/login")
    public UserLoginResponseDTO login (@RequestBody @Valid UserLoginRequestDTO userLoginRequestDTO){
        return userService.loginUser(userLoginRequestDTO);
    }

    @GetMapping("/users/me")
    public UserDTO getUserInfo() {
        return userService.getUserInfo();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getUsers(@RequestParam(required = false) String role) {
        List<UserResponseDTO> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/all")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/role")
    public void updateUsersRole(@RequestBody @Valid UserUpdateRoleDTO userUpdateRoleDTO) {
        userService.updateUsersRole(userUpdateRoleDTO);
    }

}