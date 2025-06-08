package com.anecacao.api.request.creation.domain.exception;

public class CompanyNotFoundException extends RuntimeException {
    public CompanyNotFoundException(Long companyId, Long id) {
        super("Company not found with id: " + companyId + " and legal representative with id: " + id);
    }
}
