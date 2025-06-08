package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;

public interface FumigationApplicationService {
    void createFumigationApplication(FumigationApplicationDTO fumigationRequestDTO, String jwt);
    FumigationApplicationResponseDTO getFumigationApplicationById(Long id, String token);
}