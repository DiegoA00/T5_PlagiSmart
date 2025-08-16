package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.email.data.dto.InfoUpdateEmailData;
import com.anecacao.api.email.data.dto.StatusUpdateEmailData;
import com.anecacao.api.email.domain.service.EmailService;
import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationDetailDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationInfoDTO;
import com.anecacao.api.request.creation.data.mapper.FumigationDetailMapper;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import com.anecacao.api.request.creation.domain.exception.FumigationValidationException;
import com.anecacao.api.request.creation.domain.service.FumigationService;
import io.micrometer.common.util.StringUtils;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class FumigationServiceImpl implements FumigationService {
    private final FumigationRepository repository;
    private final UserService userService;
    private final FumigationApplicationMapper mapper;
    private final FumigationDetailMapper detailMapper;
    private final EmailService emailService;

    @Override
    public void updateFumigationStatus(Long id, UpdateStatusRequestDTO updateStatusRequestDTO) {
        Fumigation fumigation = getFumigationOrThrow(id);
        validateStatusUpdate(updateStatusRequestDTO);
        String previousStatus = fumigation.getStatus().toString();

        Status status = updateStatusRequestDTO.getStatus();
        fumigation.setStatus(status);

        if (statusRequiresMessage(status)) {
            fumigation.setMessage(updateStatusRequestDTO.getMessage());
        } else {
            fumigation.setMessage(null);
        }

        repository.save(fumigation);

        User client = fumigation
                .getFumigationApplication()
                .getCompany()
                .getLegalRepresentative();

        String name = client.getFirstName() + " " + client.getLastName();

        StatusUpdateEmailData emailData = new StatusUpdateEmailData(
                fumigation.getLotNumber(),
                name,
                previousStatus,
                status.toString(),
                LocalDate.now(),
                fumigation.getMessage(),
                client.getEmail()
        );

        emailService.sendStatusUpdateEmail(emailData);
    }

    @Override
    public FumigationResponseDTO updateFumigation(Long fumigationId, FumigationCreationRequestDTO fumigationDTO, String token) {
        Fumigation fumigation = repository.findById(fumigationId)
                .orElseThrow(() -> new FumigationNotFoundException(fumigationId));

        validateUserPermission(fumigation, token);

        BigDecimal previousTons = fumigation.getTon();
        String previousPort = fumigation.getPortDestination();
        LocalDateTime previousDate = fumigation.getDateTime();
        Long previousSacks = fumigation.getSacks();

        updateFumigationData(fumigation, fumigationDTO);

        Fumigation updatedFumigation = repository.save(fumigation);

        InfoUpdateEmailData emailData = InfoUpdateEmailData.builder()
                .recipientEmail(fumigation.getFumigationApplication().getCompany().getLegalRepresentative().getEmail())
                .lotNumber(fumigation.getLotNumber())
                .clientName(fumigation.getFumigationApplication().getCompany().getLegalRepresentative().getFirstName() + " " +
                        fumigation.getFumigationApplication().getCompany().getLegalRepresentative().getLastName())
                .previousTons(previousTons)
                .newTons(fumigation.getTon().doubleValue())
                .previousPort(previousPort)
                .newPort(fumigation.getPortDestination())
                .previousDate(previousDate.toLocalDate())
                .newDate(fumigation.getDateTime().toLocalDate())
                .previousSacks(previousSacks)
                .newSacks(fumigation.getSacks())
                .build();

        emailService.sendInfoUpdateEmail(emailData);

        return mapper.toFumigationResponseDTO(updatedFumigation);
    }

    @Override
    public FumigationResponseDTO getFumigationById(Long id, String token) {
        Fumigation fumigation = repository.findById(id)
                .orElseThrow(() -> new FumigationNotFoundException(id));

        validateUserPermission(fumigation, token);

        return mapper.toFumigationResponseDTO(fumigation);
    }

    private void validateUserPermission(Fumigation fumigation, String token) {
        String userIdFromToken = userService.getUserReferenceById(token).getId().toString();
        FumigationApplication fumigationApplication = fumigation.getFumigationApplication();
        Long companyOwnerId = fumigationApplication.getCompany().getLegalRepresentative().getId();

        boolean isAuthorized = userIdFromToken.equals(companyOwnerId.toString()) ||
                userService.hasRole(userIdFromToken, RoleName.ROLE_ADMIN) ||
                userService.hasRole(userIdFromToken, RoleName.ROLE_TECHNICIAN);

        if (!isAuthorized) {
            throw new UnauthorizedAccessException("Fumigation", fumigation.getId(), Long.parseLong(userIdFromToken));
        }
    }

    private void updateFumigationData(Fumigation fumigation, FumigationCreationRequestDTO fumigationDTO) {
        fumigation.setTon(fumigationDTO.getTon());
        fumigation.setPortDestination(fumigationDTO.getPortDestination());
        fumigation.setSacks(fumigationDTO.getSacks());
        //set quality
        fumigation.setDateTime(fumigationDTO.getDateTime());
    }

    private boolean statusRequiresMessage(Status status) {
        return status == Status.REJECTED;
    }

    private Fumigation getFumigationOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new FumigationNotFoundException(id));
    }

    private void validateStatusUpdate (UpdateStatusRequestDTO dto) {
        boolean statusIsRejected = dto.getStatus() == Status.REJECTED;
        boolean messageIsBlank = StringUtils.isBlank(dto.getMessage());

        if (statusIsRejected && messageIsBlank) throw new FumigationValidationException();
    }

    @Override
    public FumigationInfoDTO getFumigationInfo(Long id, String token) {
        Fumigation fumigation = repository.findById(id)
                .orElseThrow(() -> new FumigationNotFoundException(id));

        validateUserPermission(fumigation, token);
        FumigationInfoDTO infoDTO = new FumigationInfoDTO();

        Company company = fumigation.getFumigationApplication().getCompany();
        FumigationInfoDTO.CompanyInfoDTO companyInfo = new FumigationInfoDTO.CompanyInfoDTO();
        companyInfo.setId(company.getId());
        companyInfo.setName(company.getName());
        companyInfo.setBusinessName(company.getBusinessName());
        companyInfo.setPhoneNumber(company.getPhoneNumber());
        companyInfo.setRuc(company.getRuc());
        companyInfo.setAddress(company.getAddress());
        infoDTO.setCompany(companyInfo);

        if (company.getLegalRepresentative() != null) {
            User rep = company.getLegalRepresentative();
            String fullName = (rep.getFirstName() != null ? rep.getFirstName() : "") + " " +
                    (rep.getLastName() != null ? rep.getLastName() : "");
            infoDTO.setRepresentative(fullName.trim());
        } else {
            infoDTO.setRepresentative("Unknown");
        }

        if (fumigation.getDateTime() != null) {
            infoDTO.setPlannedDate(fumigation.getDateTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")));
        } else {
            infoDTO.setPlannedDate("No date");
        }

        FumigationInfoDTO.LotInfoDTO lotInfo = new FumigationInfoDTO.LotInfoDTO();
        lotInfo.setId(fumigation.getId());
        lotInfo.setLotNumber(fumigation.getLotNumber());
        lotInfo.setTons(fumigation.getTon());
        lotInfo.setQuality(fumigation.getQuality());
        lotInfo.setSacks(fumigation.getSacks().intValue());
        lotInfo.setPortDestination(fumigation.getPortDestination().toString());
        infoDTO.setLot(lotInfo);

        return infoDTO;
    }

    @Override
    public Page<FumigationDetailDTO> getFumigationsByStatus(String status, String token, Pageable pageable) {
        Status statusEnum = parseAndValidateStatus(status);

        // Obtener el usuario del token
        User user = userService.getUserReferenceById(token);
        String userId = user.getId().toString();

        Page<Fumigation> fumigations;

        // Si es ADMIN o TECHNICIAN, devolver todas las fumigaciones con ese status
        if (userService.hasRole(userId, RoleName.ROLE_ADMIN) ||
                userService.hasRole(userId, RoleName.ROLE_TECHNICIAN)) {
            fumigations = repository.findByStatus(statusEnum, pageable);
        } else {
            // Si es CLIENT, devolver solo las fumigaciones de su compañía
            fumigations = repository.findByStatusAndUserId(statusEnum, user.getId(), pageable);
        }

        return fumigations.map(detailMapper::toDetailDto);
    }

    private Status parseAndValidateStatus(String status) {
        try {
            return Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid values are: " +
                    Arrays.toString(Status.values()));
        }
    }

}
