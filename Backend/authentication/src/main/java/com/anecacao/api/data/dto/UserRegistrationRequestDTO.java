package com.anecacao.api.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRegistrationRequestDTO {
    @NotBlank
    @Pattern(regexp = "^\\d{10}$")
    private String nationalId;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")
    private String password;

    private String location;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthday;
}
