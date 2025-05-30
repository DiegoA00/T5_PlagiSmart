package com.anecacao.api.domain.service;

import com.anecacao.api.data.dto.UserRegistrationRequestDTO;
import com.anecacao.api.data.dto.UserRegistrationResponseDTO;

public interface UserService {
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO);
}
