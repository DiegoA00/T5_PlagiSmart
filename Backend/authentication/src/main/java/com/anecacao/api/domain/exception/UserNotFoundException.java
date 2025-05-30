package com.anecacao.api.domain.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        super ("User with email: " + email + " was not found.");
    }
}
