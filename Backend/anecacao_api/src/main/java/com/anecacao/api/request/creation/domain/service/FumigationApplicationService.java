package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;

public interface FumigationApplicationService {
    void createFumigationApplication(FumigationApplicationDTO fumigationRequestDTO, String jwt);
    FumigationApplication getFumigationApplicationById(Long id);
}