package com.anecacao.api.auth.domain.service;

import com.anecacao.api.auth.data.dto.*;
import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;

public interface UserService {
    UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO);

    void completeUserInfo(UserProfileSetUpRequestDTO User);

    UserLoginResponseDTO loginUser (UserLoginRequestDTO userLoginRequestDTO);

    UserDTO getUserInfo();

    User getUserReferenceById (String token);
  
    boolean hasRole(String userId, RoleName roleName);
}
