package com.anecacao.api.auth.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRegistrationRequestDTO {
    @NotBlank(message = "National ID is required")
    @Pattern(regexp = "^\\d{10}$", message = "National ID must be 10 digits")
    private String nationalId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "Password must be at least 8 characters, with upper, lower case and a number"
    )
    private String password;

    private String location;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthday;
}
