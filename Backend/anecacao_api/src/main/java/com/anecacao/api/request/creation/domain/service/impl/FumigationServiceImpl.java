package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import com.anecacao.api.request.creation.domain.exception.FumigationValidationException;
import com.anecacao.api.request.creation.domain.service.FumigationService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FumigationServiceImpl implements FumigationService {
    private final FumigationRepository repository;

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
