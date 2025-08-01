package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
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
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FumigationServiceImpl implements FumigationService {
    private final FumigationRepository repository;
    private final UserService userService;
    private final FumigationApplicationMapper mapper;
    private final FumigationDetailMapper detailMapper;

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
            infoDTO.setPlannedDate(fumigation.getDateTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
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
    public List<FumigationDetailDTO> getFumigationsByStatus(String status) {
        Status statusEnum = parseAndValidateStatus(status);
        List<Fumigation> fumigations = repository.findByStatus(statusEnum);
        return detailMapper.toDetailDtoList(fumigations);
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
