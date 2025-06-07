package com.anecacao.api.request.creation.domain.service.exception;

public class UnauthorizedAccessException extends RuntimeException {

    public UnauthorizedAccessException(String resource, Long resourceId, Long userId) {
        super(String.format("User with ID %d is not authorized to access resource %s with ID %d", userId, resource, resourceId));
    }
}

