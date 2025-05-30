package com.anecacao.api.domain.exception;

import com.anecacao.api.data.entity.RoleName;

public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException (RoleName role) {
        super ("Role: " + role + " was not found.");
    }
}