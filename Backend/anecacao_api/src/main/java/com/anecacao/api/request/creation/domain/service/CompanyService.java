package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.auth.data.dto.CompanyCreationDTO;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.Company;

public interface CompanyService {
    Company getCompanyOwnedByLegalRepresentative(Long companyId, User user);

    boolean existsByRuc (String ruc);

    Company createNewCompany(CompanyCreationDTO company, User user);
}
