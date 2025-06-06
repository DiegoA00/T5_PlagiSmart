package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;

public interface FumigationService {
    public Fumigation updateFumigation(Long fumigationId, FumigationCreationRequestDTO fumigationDTO);
    Fumigation getFumigationById(Long fumigationId);
}