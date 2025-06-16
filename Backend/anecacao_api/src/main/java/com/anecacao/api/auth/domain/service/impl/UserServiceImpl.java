package com.anecacao.api.auth.domain.service.impl;

import com.anecacao.api.auth.config.security.JwtProvider;
import com.anecacao.api.auth.data.dto.*;
import com.anecacao.api.auth.data.entity.Role;
import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.data.mapper.UserMapper;
import com.anecacao.api.auth.data.repository.RoleRepository;
import com.anecacao.api.auth.data.repository.UserRepository;
import com.anecacao.api.auth.domain.exception.RoleNotFoundException;
import com.anecacao.api.auth.domain.exception.UserAlreadyExistsException;
import com.anecacao.api.auth.domain.exception.UserNotFoundException;
import com.anecacao.api.auth.domain.service.UserPasswordService;
import com.anecacao.api.auth.domain.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final UserPasswordService userPasswordService;
    private final JwtProvider jwtProvider;

    @Override
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO) {
        boolean credentialsAreAvailable = areUserCredentialsAvailable(userRequestDTO);

        if(!credentialsAreAvailable) throw new UserAlreadyExistsException();

        Role defaultRole = roleRepository.findByName(RoleName.ROLE_CLIENT)
                        .orElseThrow(() -> new RoleNotFoundException(RoleName.ROLE_CLIENT));

        User newUser = buildNewUser(userRequestDTO, Set.of(defaultRole));

        userRepository.save(newUser);
        userPasswordService.savePassword(newUser, userRequestDTO.getPassword());

        return userMapper.userToUserRegistrationResponseDTO(newUser);
    }

    @Override
    public UserLoginResponseDTO loginUser(UserLoginRequestDTO userLoginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                userLoginRequestDTO.getEmail(),
                userLoginRequestDTO.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);

        userRepository.findByEmail(userLoginRequestDTO.getEmail())
                .orElseThrow(() -> new UserNotFoundException(userLoginRequestDTO.getEmail()));

        UserLoginResponseDTO userLoginResponseDTO = new UserLoginResponseDTO();
        userLoginResponseDTO.setToken(token);

        return userLoginResponseDTO;
    }

    @Override
    public UserDTO getUserInfo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));

        return userMapper.userToUserDTO(user);
    }

    @Override
    public User getUserReferenceById (String token) {
        jwtProvider.validateToken(token);
        return userRepository.getReferenceById(jwtProvider.getUserIdFromJWT(token));
    }

    private User buildNewUser (UserRegistrationRequestDTO userDTO, Set<Role> roles) {
        User newUser = userMapper.userRegistrationRequestDTOToUser(userDTO);
        newUser.setRoles(roles);
        return newUser;
    }

    private boolean areUserCredentialsAvailable(UserRegistrationRequestDTO userRequestDTO){
        boolean nationalIdIsAvailable = !userRepository.existsUserByNationalId(userRequestDTO.getNationalId());
        boolean emailIsAvailable = !userRepository.existsUserByEmail(userRequestDTO.getEmail());

        return nationalIdIsAvailable && emailIsAvailable;
    }

    @Override
    public boolean hasRole(String userId, RoleName roleName) {
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

}
