package com.anecacao.api.auth.data.dto;

import com.anecacao.api.auth.data.entity.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserUpdateRoleDTO {
    @NotNull(message = "Email cannot be null")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Role cannot be null")
    private RoleName role;
}
