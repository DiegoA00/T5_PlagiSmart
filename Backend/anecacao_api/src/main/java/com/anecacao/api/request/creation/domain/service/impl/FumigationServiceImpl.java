package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
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
        fumigation.setGrade(fumigationDTO.getGrade());
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
}
