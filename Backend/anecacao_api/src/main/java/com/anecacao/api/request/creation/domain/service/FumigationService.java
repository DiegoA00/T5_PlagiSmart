package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;

public interface FumigationService {
    FumigationResponseDTO updateFumigation(Long fumigationId, FumigationCreationRequestDTO fumigationDTO, String token);
    FumigationResponseDTO getFumigationById(Long id, String token);
    void updateFumigationStatus(Long id, UpdateStatusRequestDTO updateStatusRequestDTO);
}
