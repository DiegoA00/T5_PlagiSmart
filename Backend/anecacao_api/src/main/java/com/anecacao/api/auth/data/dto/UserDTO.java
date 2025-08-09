package com.anecacao.api.auth.data.dto;

import com.anecacao.api.request.creation.data.dto.response.CompanyResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    private String nationalId;

    private String firstName;

    private String lastName;

    private String email;

    private Set<RoleDTO> roles;

    private Set<CompanyResponseDTO> companies;

    private LocalDate birthday;

    private String country;

    private String city;

    private String personalPhone;
}