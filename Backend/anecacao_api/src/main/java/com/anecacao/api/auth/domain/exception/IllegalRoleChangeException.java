package com.anecacao.api.auth.domain.exception;

public class IllegalRoleChangeException extends RuntimeException {
    public IllegalRoleChangeException() {
        super("Admins cannot change their own role");
    }
}
