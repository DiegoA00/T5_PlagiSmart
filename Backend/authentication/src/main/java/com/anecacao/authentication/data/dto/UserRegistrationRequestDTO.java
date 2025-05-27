package com.anecacao.authentication.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserRegistrationRequestDTO {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Pattern(regexp = "^\\d{10}$")
    private String nationalId;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")
    private String password;

    @NotBlank
    @Email
    private String email;

    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;
}
