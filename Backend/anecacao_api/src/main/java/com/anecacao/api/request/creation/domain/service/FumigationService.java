package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationInfoDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationSummaryDTO;

import java.util.List;

public interface FumigationService {
    FumigationResponseDTO updateFumigation(Long fumigationId, FumigationCreationRequestDTO fumigationDTO, String token);
    FumigationResponseDTO getFumigationById(Long id, String token);
    void updateFumigationStatus(Long id, UpdateStatusRequestDTO updateStatusRequestDTO);
    FumigationInfoDTO getFumigationInfo(Long id, String token);
    List<FumigationSummaryDTO> getFumigationsByStatus(String status);
}