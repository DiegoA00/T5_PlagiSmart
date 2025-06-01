package com.anecacao.api.request.creation.entity.service;

import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;

public interface FumigationApplicationService {
    void createFumigationApplication(FumigationApplicationDTO fumigationRequestDTO, String jwt);
}