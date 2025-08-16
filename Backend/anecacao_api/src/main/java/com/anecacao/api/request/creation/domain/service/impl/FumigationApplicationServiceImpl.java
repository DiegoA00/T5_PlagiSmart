package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.dto.UserDTO;
import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.domain.exception.UserInvalidException;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.email.data.dto.AdminNotificationEmailData;
import com.anecacao.api.email.data.dto.EmailRequestData;
import com.anecacao.api.email.domain.service.EmailService;
import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.ClientFumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationSummaryDTO;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.mapper.ClientFumigationApplicationMapper;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationSummaryMapper;
import com.anecacao.api.request.creation.data.repository.FumigationApplicationRepository;
import com.anecacao.api.request.creation.domain.service.CompanyService;
import com.anecacao.api.request.creation.domain.exception.FumigationApplicationNotFoundException;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FumigationApplicationServiceImpl implements FumigationApplicationService {
    private final FumigationApplicationRepository repository;
    private final UserService userService;
    private final CompanyService companyService;
    private final FumigationApplicationMapper mapper;
    private final FumigationApplicationSummaryMapper summaryMapper;
    private final ClientFumigationApplicationMapper clientMapper;
    private final EmailService emailService;

    @Override
    public FumigationApplicationResponseDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt) {
        if (!userService.hasCompletedProfile()) throw new UserInvalidException();

        Company company = findCompany(jwt, dto.getCompany().getId());
        FumigationApplication newFumigation = saveNewFumigationApplication(dto, company, Status.PENDING);

        UserDTO currentUser = userService.getUserInfo();

        EmailRequestData emailData = EmailRequestData.builder()
                .recipientEmail(currentUser.getEmail())
                .requestId(newFumigation.getId())
                .clientName(currentUser.getFirstName() + " " + currentUser.getLastName())
                .companyName(company.getBusinessName())
                .companyRuc(company.getRuc())
                .requestDate(newFumigation.getCreatedAt())
                .lotCount(newFumigation.getFumigations().size())
                .totalTons(newFumigation.getFumigations()
                        .stream()
                        .map(Fumigation::getTon)
                        .mapToDouble(BigDecimal::doubleValue)
                        .sum())
                .build();

        emailService.sendApplicationReceivedEmail(emailData);

        List<AdminNotificationEmailData.LotDetail> lotDetails = newFumigation.getFumigations().stream()
                .map(f -> {
                    AdminNotificationEmailData.LotDetail lot = new AdminNotificationEmailData.LotDetail();
                    lot.setLotNumber(f.getLotNumber());
                    lot.setTons(f.getTon().doubleValue());
                    lot.setSacks(f.getSacks());
                    lot.setPort(f.getPortDestination());
                    return lot;
                })
                .toList();

        Page<UserResponseDTO> admins = userService.getUsersByRole("ADMIN", Pageable.unpaged());

        AdminNotificationEmailData adminEmailData = new AdminNotificationEmailData();
        adminEmailData.setRecipientEmail(admins.stream().map(UserResponseDTO::getEmail).toList().get(0)); // !!
        adminEmailData.setRequestId(newFumigation.getId());
        adminEmailData.setCompanyName(company.getBusinessName());
        adminEmailData.setCompanyRuc(company.getRuc());
        adminEmailData.setLegalRepresentative(company.getLegalRepresentative().getFirstName() + " " + company.getLegalRepresentative().getLastName());
        adminEmailData.setContactEmail(currentUser.getEmail());
        adminEmailData.setContactPhone(currentUser.getPersonalPhone());
        adminEmailData.setLotCount(newFumigation.getFumigations().size());
        adminEmailData.setTotalTons(newFumigation.getFumigations()
                .stream()
                .map(Fumigation::getTon)
                .mapToDouble(BigDecimal::doubleValue)
                .sum());
        adminEmailData.setPriority("ALTA");
        adminEmailData.setLotDetails(lotDetails);

        emailService.sendAdminNotificationEmail(adminEmailData);

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

    @Override
    public Page<FumigationApplicationSummaryDTO> getFumigationApplicationsByStatus(String status, Pageable pageable) {
        Status statusEnum = parseAndValidateStatus(status);
        Page<FumigationApplication> applications = repository.findByFumigationStatus(statusEnum, pageable);
        return applications.map(app -> summaryMapper.toSummaryDto(app, status.toUpperCase()));
    }

    private Status parseAndValidateStatus(String status) {
        try {
            return Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid values are: " +
                    Arrays.toString(Status.values()));
        }
    }

    @Override
    public Page<ClientFumigationApplicationDTO> getClientFumigationApplications(String token, Pageable pageable) {
        // Obtener el usuario del token
        User user = userService.getUserReferenceById(token);

        // Validar que sea un cliente
        if (!userService.hasRole(user.getId().toString(), RoleName.ROLE_CLIENT)) {
            // Usar la excepción con el formato correcto: resource, resourceId, userId
            throw new UnauthorizedAccessException("ClientFumigationApplications", 0L, user.getId());
        }

        // Obtener todas las aplicaciones del cliente
        Page<FumigationApplication> applications = repository.findByCompanyLegalRepresentativeId(user.getId(), pageable);

        // Mapear a DTO con los campos calculados usando el mapper dedicado
        return applications.map(clientMapper::toDto);
    }
}
