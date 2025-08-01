package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationSummaryDTO;

import java.util.List;

public interface FumigationApplicationService {
    FumigationApplicationResponseDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt);
    FumigationApplicationResponseDTO getFumigationApplicationById(Long id, String token);
//    List<FumigationApplicationSummaryDTO> getFumigationApplicationsByStatus(String status);
}
