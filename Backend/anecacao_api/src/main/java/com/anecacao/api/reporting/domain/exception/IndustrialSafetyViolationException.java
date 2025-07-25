package com.anecacao.api.reporting.domain.exception;

public class IndustrialSafetyViolationException extends RuntimeException {
    public IndustrialSafetyViolationException(Long id) {
        super ("Industrial safety violation detected for fumigation with ID: " + id);
    }
}
