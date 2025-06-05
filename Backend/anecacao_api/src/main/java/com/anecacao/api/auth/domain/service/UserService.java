package com.anecacao.api.auth.domain.service;

import com.anecacao.api.auth.data.dto.*;

public interface UserService {
    UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO);

    UserLoginResponseDTO loginUser (UserLoginRequestDTO userLoginRequestDTO);

    UserDTO getUserInfo();
}
