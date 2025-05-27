package com.anecacao.authentication.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserRegistrationResponseDTO {

    private String firstName;

    private String lastName;

    private String nationalId;

    private String email;

    private String location;
    
    private LocalDateTime birthday;
}
