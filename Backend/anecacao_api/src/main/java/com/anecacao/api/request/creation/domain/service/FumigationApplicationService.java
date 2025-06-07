package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;

public interface FumigationApplicationService {
    void createFumigationApplication(FumigationApplicationDTO fumigationRequestDTO, String jwt);
    FumigationApplicationDTO getFumigationApplicationById(Long id, String token);
}