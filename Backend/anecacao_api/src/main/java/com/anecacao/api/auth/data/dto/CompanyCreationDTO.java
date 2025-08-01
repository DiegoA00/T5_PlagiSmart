package com.anecacao.api.auth.data.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CompanyCreationDTO {
    @NotBlank(message = "Company Name is required")
    private String companyName;

    @NotBlank(message = "Business Name is required")
    private String businessName;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;

    @NotBlank(message = "RUC is required")
    @Pattern(regexp = "^\\d{13}$", message = "RUC must be 13 digits")
    private String ruc;

    @NotBlank(message = "Address is required")
    private String address;
}
