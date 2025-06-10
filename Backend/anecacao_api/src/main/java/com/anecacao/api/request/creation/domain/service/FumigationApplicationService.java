package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;

public interface FumigationApplicationService {
    FumigationApplicationResponseDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt);
    FumigationApplicationResponseDTO getFumigationApplicationById(Long id, String token);
}
