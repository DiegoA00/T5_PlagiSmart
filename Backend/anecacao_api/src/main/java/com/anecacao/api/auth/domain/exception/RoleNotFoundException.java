package com.anecacao.api.auth.domain.exception;

import com.anecacao.api.auth.data.entity.RoleName;

public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException (RoleName role) {
        super ("Role: " + role + " was not found.");
    }
}