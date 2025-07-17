package com.anecacao.api.auth.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationResponseDTO {
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private List<RoleDTO> roles;
}
