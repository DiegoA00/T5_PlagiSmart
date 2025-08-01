package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationDetailDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationInfoDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationSummaryDTO;
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
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FumigationServiceImpl implements FumigationService {
    private final FumigationRepository repository;
    private final UserService userService;
    private final FumigationApplicationMapper mapper;

    @Override
    public void updateFumigationStatus(Long id, UpdateStatusRequestDTO updateStatusRequestDTO) {
        Fumigation fumigation = getFumigationOrThrow(id);
        validateStatusUpdate(updateStatusRequestDTO);

        Status status = updateStatusRequestDTO.getStatus();
        fumigation.setStatus(status);

        if (statusRequiresMessage(status)) {
            fumigation.setMessage(updateStatusRequestDTO.getMessage());
        } else {
            fumigation.setMessage(null);
        }

        repository.save(fumigation);
    }

    @Override
    public FumigationResponseDTO updateFumigation(Long fumigationId, FumigationCreationRequestDTO fumigationDTO, String token) {
        Fumigation fumigation = repository.findById(fumigationId)
                .orElseThrow(() -> new FumigationNotFoundException(fumigationId));

        validateUserPermission(fumigation, token);
        updateFumigationData(fumigation, fumigationDTO);

        return mapper.toFumigationResponseDTO(repository.save(fumigation));
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

        boolean isAuthorized = userIdFromToken.equals(companyOwnerId.toString()) || userService.hasRole(userIdFromToken, RoleName.ROLE_ADMIN);

        if (!isAuthorized) {
            throw new UnauthorizedAccessException("Fumigation", fumigation.getId(), Long.parseLong(userIdFromToken));
        }
    }

    private void updateFumigationData(Fumigation fumigation, FumigationCreationRequestDTO fumigationDTO) {
        fumigation.setTon(fumigationDTO.getTon());
        fumigation.setPortDestination(fumigationDTO.getPortDestination());
        fumigation.setSacks(fumigationDTO.getSacks());
        fumigation.setQuality(fumigationDTO.getQuality());
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

        // Company info
        Company company = fumigation.getFumigationApplication().getCompany();
        FumigationInfoDTO.CompanyInfoDTO companyInfo = new FumigationInfoDTO.CompanyInfoDTO();
        companyInfo.setId(company.getId());
        companyInfo.setName(company.getName());
        infoDTO.setCompany(companyInfo);

        // Lot info
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

    /*
    @Override
    public List<FumigationDetailDTO> getFumigationsByStatus(String status) {
        Status statusEnum;
        try {
            statusEnum = Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid values are: " +
                    Arrays.toString(Status.values()));
        }

        List<Fumigation> fumigations = repository.findByStatus(statusEnum);

        return fumigations.stream()
                .map(fumigation -> {
                    FumigationDetailDTO dto = new FumigationDetailDTO();

                    // Lot number
                    dto.setLotNumber(fumigation.getLotNumber() != null ? fumigation.getLotNumber() : "No lot number");

                    // Company information
                    if (fumigation.getFumigationApplication() != null &&
                            fumigation.getFumigationApplication().getCompany() != null) {

                        Company company = fumigation.getFumigationApplication().getCompany();

                        // Company name
                        dto.setCompanyName(company.getName() != null ? company.getName() : "Unknown");

                        // Phone number
                        dto.setPhoneNumber(company.getPhoneNumber() != null ? company.getPhoneNumber() : "No phone");

                        // Representative (firstName + lastName)
                        if (company.getLegalRepresentative() != null) {
                            User rep = company.getLegalRepresentative();
                            String fullName = (rep.getFirstName() != null ? rep.getFirstName() : "") + " " +
                                    (rep.getLastName() != null ? rep.getLastName() : "");
                            dto.setRepresentative(fullName.trim());
                        } else {
                            dto.setRepresentative("Unknown");
                        }
                    } else {
                        dto.setCompanyName("Unknown");
                        dto.setPhoneNumber("No phone");
                        dto.setRepresentative("Unknown");
                    }

                    // Location - primero de fumigation, luego de company address
                    String location = fumigation.getLocation();
                    if (location == null || location.isEmpty()) {
                        if (fumigation.getFumigationApplication() != null &&
                                fumigation.getFumigationApplication().getCompany() != null) {
                            location = fumigation.getFumigationApplication().getCompany().getAddress();
                        }
                    }
                    dto.setLocation(location != null ? location : "No location");

                    return dto;
                })
                .collect(Collectors.toList());
    }*/

}
