package com.anecacao.api.auth.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserProfileSetUpRequestDTO {
    @NotBlank(message = "National ID is required")
    @Pattern(regexp = "^\\d{10}$", message = "National ID must be 10 digits")
    private String nationalId;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthday;

    @NotNull(message = "Company information is required")
    private CompanyCreationDTO company;

    @NotNull(message = "Country is required")
    private String country;

    @NotNull(message = "City is required")
    private String city;

    @NotNull(message = "Personal phone is required")
    private String personalPhone;
}
