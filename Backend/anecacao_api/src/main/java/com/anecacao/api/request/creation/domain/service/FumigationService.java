package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;

public interface FumigationService {
    void updateFumigationStatus(Long id, UpdateStatusRequestDTO updateStatusRequestDTO);
}