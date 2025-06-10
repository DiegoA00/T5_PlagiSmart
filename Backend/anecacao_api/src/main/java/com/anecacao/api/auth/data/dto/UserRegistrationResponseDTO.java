package com.anecacao.api.auth.data.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationResponseDTO {
    private Long id;

    private String nationalId;

    private String firstName;

    private String lastName;

    private String email;

    private String location;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthday;

    private List<RoleDTO> roles;
}
