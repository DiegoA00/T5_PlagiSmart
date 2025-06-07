package com.anecacao.api.request.creation.domain.exception;

public class FumigationNotFoundException extends RuntimeException {

    public FumigationNotFoundException(Long fumigationId) {
        super(String.format("Fumigation not found with ID: %d", fumigationId));
    }
}

