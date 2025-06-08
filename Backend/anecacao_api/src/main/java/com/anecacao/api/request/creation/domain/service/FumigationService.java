package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.data.dto.FumigationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;

public interface FumigationService {
    FumigationResponseDTO updateFumigation(Long fumigationId, FumigationDTO fumigationDTO, String token);
    Fumigation getFumigationById(Long fumigationId);
    void updateFumigationStatus(Long id, UpdateStatusRequestDTO updateStatusRequestDTO);
    void validateUserPermission(Fumigation fumigation, String token);
}
