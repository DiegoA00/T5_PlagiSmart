package com.anecacao.api.auth.domain.exception;

public class CompanyAlreadyExistsException extends RuntimeException {
    public CompanyAlreadyExistsException() {
        super("RUC already in use");
    }
}
