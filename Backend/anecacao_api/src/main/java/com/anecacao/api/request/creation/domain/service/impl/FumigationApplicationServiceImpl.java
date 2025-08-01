package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationSummaryDTO;
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
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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

    /*
    @Override
    public List<FumigationApplicationSummaryDTO> getFumigationApplicationsByStatus(String status) {
        // Validar y convertir el status
        Status statusEnum;
        try {
            statusEnum = Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid values are: " +
                    Arrays.toString(Status.values()));
        }

        // Obtener las aplicaciones que tienen fumigaciones con el estado especificado
        List<FumigationApplication> applications = repository.findByFumigationStatus(statusEnum);

        // Mapear a DTOs
        return applications.stream()
                .map(app -> {
                    FumigationApplicationSummaryDTO dto = new FumigationApplicationSummaryDTO();
                    dto.setId(app.getId());

                    // Company name
                    dto.setCompanyName(app.getCompany() != null ? app.getCompany().getName() : "Unknown");

                    // Representative (firstName + lastName)
                    if (app.getCompany() != null && app.getCompany().getLegalRepresentative() != null) {
                        User rep = app.getCompany().getLegalRepresentative();
                        String fullName = (rep.getFirstName() != null ? rep.getFirstName() : "") + " " +
                                (rep.getLastName() != null ? rep.getLastName() : "");
                        dto.setRepresentative(fullName.trim());
                    } else {
                        dto.setRepresentative("Unknown");
                    }

                    // Location - primero intentar obtener de fumigation, si no hay usar address de company
                    String location = app.getFumigations().stream()
                            .filter(f -> f.getLocation() != null && !f.getLocation().isEmpty())
                            .map(f -> f.getLocation())
                            .findFirst()
                            .orElse(app.getCompany() != null ? app.getCompany().getAddress() : "No location");
                    dto.setLocation(location);

                    // Local date - obtener de actualFumigationDate o dateTime
                    String localDate = app.getFumigations().stream()
                            .map(f -> {
                                // Primero intentar actualFumigationDate
                                if (f.getActualFumigationDate() != null) {
                                    return f.getActualFumigationDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                                }
                                // Si no hay, usar dateTime
                                else if (f.getDateTime() != null) {
                                    return f.getDateTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                                }
                                return null;
                            })
                            .filter(date -> date != null)
                            .findFirst()
                            .orElse("No date");
                    dto.setLocalDate(localDate);

                    // Status
                    dto.setStatus(status.toUpperCase());

                    return dto;
                })
                .collect(Collectors.toList());
    }*/

}
