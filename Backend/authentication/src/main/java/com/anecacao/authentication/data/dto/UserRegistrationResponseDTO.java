package com.anecacao.authentication.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRegistrationResponseDTO {
    private Long id;

    private String nationalId;

    private String firstName;

    private String lastName;

    private String email;

    private String role;

    private String location;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthday;
}
