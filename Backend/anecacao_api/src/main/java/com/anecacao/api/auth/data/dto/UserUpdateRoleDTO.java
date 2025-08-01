package com.anecacao.api.auth.data.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserUpdateRoleDTO {
    @Email
    private String email;
}
