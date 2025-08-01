package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.repository.FumigationApplicationRepository;
import com.anecacao.api.request.creation.domain.service.CompanyService;
import com.anecacao.api.request.creation.domain.exception.FumigationApplicationNotFoundException;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FumigationApplicationServiceImpl implements FumigationApplicationService {
    private final FumigationApplicationRepository repository;
    private final UserService userService;
    private final CompanyService companyService;
    private final FumigationApplicationMapper mapper;

    @Override
    public FumigationApplicationResponseDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt) {
        Company company = findCompany(jwt, dto.getCompany().getId());
        FumigationApplication newFumigation = saveNewFumigationApplication(dto, company, Status.PENDING);

        return mapper.toFumigationApplicationResponseDTO(newFumigation);
    }

    @Override
    public FumigationApplicationResponseDTO getFumigationApplicationById(Long id, String token) {

        FumigationApplication fumigationApplication = repository.findById(id)
                .orElseThrow(() -> new FumigationApplicationNotFoundException(id));

        validateUserPermission(fumigationApplication, id, token);

        return mapper.toFumigationApplicationResponseDTO(fumigationApplication);
    }

    private void validateUserPermission(FumigationApplication fumigationApplication, Long id, String token) {
        String userIdFromToken = userService.getUserReferenceById(token).getId().toString();

        Long companyOwnerId = fumigationApplication.getCompany().getLegalRepresentative().getId();
        boolean isAuthorized = userIdFromToken.equals(companyOwnerId.toString()) || userService.hasRole(userIdFromToken, RoleName.ROLE_ADMIN);

        if (!isAuthorized) {
            throw new UnauthorizedAccessException("FumigationApplication", id, Long.parseLong(userIdFromToken));
        }
    }

    private Company findCompany (String jwt, Long id) {
        User legalRepresentative = userService.getUserReferenceById(jwt);
        return companyService.getCompanyOwnedByLegalRepresentative(id, legalRepresentative);
    }

    private FumigationApplication saveNewFumigationApplication (FumigationApplicationDTO dto, Company company, Status status) {
        FumigationApplication newApplication = mapper.toEntity(dto);
        newApplication.setCompany(company);
        newApplication.setCreatedAt(LocalDate.now());
        newApplication.getFumigations().forEach(f -> f.setStatus(status));

        return repository.save(newApplication);
    }
}
