package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;

public interface FumigationApplicationService {
    FumigationApplicationResponseDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt);
}