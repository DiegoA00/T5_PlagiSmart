package com.anecacao.api.auth.domain.service;

import com.anecacao.api.auth.data.dto.*;
import com.anecacao.api.auth.data.entity.User;

public interface UserService {
    UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO);

    UserLoginResponseDTO loginUser (UserLoginRequestDTO userLoginRequestDTO);

    UserDTO getUserInfo();

    public boolean hasRole(String userId, String roleName);

    public User getUserReferenceById(String token);
}
