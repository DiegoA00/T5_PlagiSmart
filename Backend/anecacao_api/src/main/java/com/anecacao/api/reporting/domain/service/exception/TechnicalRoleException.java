package com.anecacao.api.reporting.domain.service.exception;

public class TechnicalRoleException extends RuntimeException {
    public TechnicalRoleException(String id) {
        super ("User with ID " + id + " does not have the TECHNICIAN role.");
    }
}
