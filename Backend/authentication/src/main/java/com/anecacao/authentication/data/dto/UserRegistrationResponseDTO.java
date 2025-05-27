package com.anecacao.authentication.data.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRegistrationResponseDTO {

    private String firstName;

    private String lastName;

    private String nationalId;

    private String email;

    private String location;

    private LocalDate birthday;
}
