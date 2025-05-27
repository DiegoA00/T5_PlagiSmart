package com.anecacao.authentication.domain.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException() {
        super("User credentials are already in use");
    }
}
