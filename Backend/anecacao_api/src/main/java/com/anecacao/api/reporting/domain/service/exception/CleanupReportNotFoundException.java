package com.anecacao.api.reporting.domain.service.exception;

public class CleanupReportNotFoundException extends RuntimeException {

  public CleanupReportNotFoundException(Long id) {
    super("Cleanup report not found with id: " + id);
  }

  public CleanupReportNotFoundException(String message) {
    super(message);
  }
}
