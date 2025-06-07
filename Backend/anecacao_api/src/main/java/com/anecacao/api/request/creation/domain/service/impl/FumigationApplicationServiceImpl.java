package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.CompanyRequestDTO;
import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.repository.FumigationApplicationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationApplicationNotFoundException;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FumigationApplicationServiceImpl implements FumigationApplicationService {
    @Override
    public void createFumigationApplication(FumigationApplicationDTO fumigationRequestDTO, String jwt) {
    }
    private final FumigationApplicationRepository fumigationApplicationRepository;
    private final UserService userService;

    @Override
    public FumigationApplicationDTO getFumigationApplicationById(Long id, String token) {

        FumigationApplication fumigationApplication = fumigationApplicationRepository.findById(id)
                .orElseThrow(() -> new FumigationApplicationNotFoundException(id));

        validateUserPermission(fumigationApplication, id, token);

        return new FumigationApplicationDTO(
                new CompanyRequestDTO(
                        fumigationApplication.getCompany().getId()
                ),
                fumigationApplication.getFumigations().stream()
                        .map(fumigation -> new FumigationCreationRequestDTO(
                                fumigation.getTon(),
                                fumigation.getPortDestination(),
                                fumigation.getSacks(),
                                fumigation.getGrade(),
                                fumigation.getDateTime()
                        ))
                        .collect(Collectors.toList())
        );
    }

    private void validateUserPermission(FumigationApplication fumigationApplication, Long id, String token) {
        String userIdFromToken = userService.getUserReferenceById(token).getId().toString();

        Long companyOwnerId = fumigationApplication.getCompany().getLegalRepresentative().getId();

        boolean isAuthorized = userIdFromToken.equals(companyOwnerId.toString());

        if (!isAuthorized) {
            throw new UnauthorizedAccessException("FumigationApplication", id, Long.parseLong(userIdFromToken));
        }
    }
}
