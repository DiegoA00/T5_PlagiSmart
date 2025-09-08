package com.anecacao.api.auth.domain.service;

import com.anecacao.api.auth.data.dto.*;
import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO);

    void completeUserInfo(UserProfileSetUpRequestDTO User);

    UserLoginResponseDTO loginUser (UserLoginRequestDTO userLoginRequestDTO);

    UserDTO getUserInfo();

    User getUserReferenceById (String token);
  
    boolean hasRole(String userId, RoleName roleName);

    boolean hasCompletedProfile();

    void updateUsersRole(UserUpdateRoleDTO userUpdateRoleDTO);

    void createAdminUserIfNotExist();

    Page<UserResponseDTO> getUsersByRole(String role, Pageable pageable);

    Page<UserResponseDTO> getAllUsers(Pageable pageable);
}
