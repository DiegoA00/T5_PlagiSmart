package com.anecacao.api.request.creation.domain.exception;

public class FumigationValidationException extends RuntimeException {
    public FumigationValidationException() {
        super ("Message is required when status is REJECTED.");
    }
}
