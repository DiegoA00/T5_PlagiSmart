package com.anecacao.authentication.domain.service;

import com.anecacao.authentication.data.dto.UserRegistrationRequestDTO;
import com.anecacao.authentication.data.dto.UserRegistrationResponseDTO;

public interface UserService {
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO);
}
