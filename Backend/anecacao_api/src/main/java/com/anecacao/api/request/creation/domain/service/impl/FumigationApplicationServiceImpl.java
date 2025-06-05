package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.repository.FumigationApplicationRepository;
import com.anecacao.api.request.creation.domain.service.CompanyService;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FumigationApplicationServiceImpl implements FumigationApplicationService {
    private final FumigationApplicationRepository repository;
    private final UserService userService;
    private final CompanyService companyService;
    private final FumigationApplicationMapper mapper;

    @Override
    public MessageDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt) {
        Company company = findCompany(jwt, dto.getCompany().getId());
        saveNewFumigationApplication(dto, company, Status.PENDING);
        return new MessageDTO("Fumigation application created successfully.");
    }

    private Company findCompany (String jwt, Long id) {
        User legalRepresentative = userService.getUserReferenceById(jwt);
        return companyService.getCompanyOwnedByLegalRepresentative(id, legalRepresentative);
    }

    private FumigationApplication saveNewFumigationApplication (FumigationApplicationDTO dto, Company company, Status status) {
        FumigationApplication newApplication = mapper.toEntity(dto);
        newApplication.setCompany(company);
        newApplication.getFumigations().forEach(f -> f.setStatus(status));

        return repository.save(newApplication);
    }
}
