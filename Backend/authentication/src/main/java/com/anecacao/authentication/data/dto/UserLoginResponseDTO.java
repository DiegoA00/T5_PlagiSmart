package com.anecacao.authentication.data.dto;

import lombok.Data;

@Data
public class UserLoginResponseDTO {

    private String token;

    private String tokenType;
}
