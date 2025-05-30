package com.anecacao.authentication.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
