package com.anecacao.api.request.creation.domain.exception;

public class FumigationNotFoundException extends RuntimeException {
    public FumigationNotFoundException(Long id) {
        super ("Fumigation with id: " + id + " was not found.");
    }
}
