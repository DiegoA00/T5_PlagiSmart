package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.dto.CompanyCreationDTO;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.repository.CompanyRepository;
import com.anecacao.api.request.creation.domain.exception.CompanyNotFoundException;
import com.anecacao.api.request.creation.domain.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository repository;

    @Override
    public Company getCompanyOwnedByLegalRepresentative(Long companyId, User user) {
        return repository
                .findByIdAndLegalRepresentative(companyId, user)
                .orElseThrow(() -> new CompanyNotFoundException(companyId, user.getId()));
    }

    @Override
    public boolean existsByRuc(String ruc) {
        return repository.existsByRuc(ruc);
    }

    @Override
    public Company createNewCompany(CompanyCreationDTO companyDTO, User user) {
        Company company = new Company();
        company.setName(companyDTO.getCompanyName());
        company.setBusinessName(companyDTO.getBusinessName());
        company.setPhoneNumber(companyDTO.getPhoneNumber());
        company.setRuc(companyDTO.getRuc());
        company.setAddress(companyDTO.getAddress());
        company.setLegalRepresentative(user);
        return company;
    }
}
