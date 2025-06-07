package com.anecacao.api.request.creation.domain.service.exception;

public class FumigationApplicationNotFoundException extends RuntimeException {

    public FumigationApplicationNotFoundException(Long fumigationApplicationId) {
        super(String.format("FumigationApplication not found with ID: %d", fumigationApplicationId));
    }
}
