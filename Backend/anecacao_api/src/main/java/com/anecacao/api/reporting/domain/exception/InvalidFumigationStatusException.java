package com.anecacao.api.reporting.domain.exception;

public class InvalidFumigationStatusException extends RuntimeException {
    public InvalidFumigationStatusException(Long id) {
        super ("Fumigation with ID " + id + " cannot be reported because it is not in an approved or failed state.");
    }
}
