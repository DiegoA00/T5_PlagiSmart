package com.anecacao.api.auth.domain.service.impl;

import com.anecacao.api.auth.config.security.JwtProvider;
import com.anecacao.api.auth.data.dto.*;
import com.anecacao.api.auth.data.entity.Role;
import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.data.entity.UserPassword;
import com.anecacao.api.auth.data.mapper.UserMapper;
import com.anecacao.api.auth.data.repository.RoleRepository;
import com.anecacao.api.auth.data.repository.UserPasswordRepository;
import com.anecacao.api.auth.data.repository.UserRepository;
import com.anecacao.api.auth.domain.exception.*;
import com.anecacao.api.auth.domain.service.UserPasswordService;
import com.anecacao.api.auth.domain.service.UserService;

import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.domain.service.CompanyService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final UserPasswordService userPasswordService;
    private final CompanyService companyService;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserPasswordRepository userPasswordRepository;

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
    public void completeUserInfo(UserProfileSetUpRequestDTO request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        if (userRepository.existsByNationalIdAndIdNot(request.getNationalId(), user.getId())) {
            throw new UserAlreadyExistsException();
        }

        if (companyService.existsByRuc(request.getCompany().getRuc())) {
            throw new CompanyAlreadyExistsException();
        }

        user.setNationalId(request.getNationalId());
        user.setBirthday(request.getBirthday());

        Company company = companyService.createNewCompany(request.getCompany(), user);

        user.getCompanies().add(company);

        userRepository.save(user);
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
    public void updateUsersRole(UserUpdateRoleDTO userUpdateRoleDTO) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(userUpdateRoleDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));

        if (userUpdateRoleDTO.getEmail().equals(email)) throw new IllegalRoleChangeException();

        Role role = roleRepository.findByName(RoleName.ROLE_TECHNICIAN)
                .orElseThrow(() -> new RuntimeException("Role not found."));

        user.getRoles().add(role);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void createAdminUserIfNotExist() {
        Optional<User> adminUser = userRepository.findByEmail("admin");

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));


        if (adminUser.isEmpty()) {
            User user = new User();
            user.setEmail("admin@admin.com");
            user.setFirstName("admin");
            user.setRoles(Set.of(adminRole));

            userRepository.save(user);

            UserPassword userPassword = new UserPassword();
            userPassword.setUser(user);
            userPassword.setHashedPassword(passwordEncoder.encode("admin"));

            userPasswordRepository.save(userPassword);
        }
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
        return !userRepository.existsUserByEmail(userRequestDTO.getEmail());
    }

    @Override
    public boolean hasRole(String userId, RoleName roleName) {
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

    @Override
    public List<UserResponseDTO> getUsersByRole(String role) {
        RoleName roleName;
        try {
            // Convertir el string del parámetro al enum RoleName
            roleName = RoleName.valueOf("ROLE_" + role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }

        List<User> users = userRepository.findByRoleName(roleName);

        return users.stream()
                .map(user -> {
                    UserResponseDTO dto = new UserResponseDTO();
                    dto.setId(user.getId());
                    dto.setNationalId(user.getNationalId());
                    dto.setFirstName(user.getFirstName());
                    dto.setLastName(user.getLastName());
                    dto.setEmail(user.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
