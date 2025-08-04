package com.anecacao.api.auth.domain.exception;

public class UserInvalidException extends RuntimeException {
    public UserInvalidException() {
        super("User profile is incomplete or invalid. Please complete your profile setup.");
    }
}
