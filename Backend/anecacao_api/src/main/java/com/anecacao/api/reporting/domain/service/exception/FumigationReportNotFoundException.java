package com.anecacao.api.reporting.domain.service.exception;

public class FumigationReportNotFoundException extends RuntimeException {

    public FumigationReportNotFoundException(Long id) {
        super("Fumigation report not found with id: " + id);
    }

    public FumigationReportNotFoundException(String message) {
        super(message);
    }
}
