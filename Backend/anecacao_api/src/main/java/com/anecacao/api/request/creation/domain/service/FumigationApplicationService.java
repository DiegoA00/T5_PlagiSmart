package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.ClientFumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FumigationApplicationService {
    FumigationApplicationResponseDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt);
    FumigationApplicationResponseDTO getFumigationApplicationById(Long id, String token);
    Page<FumigationApplicationSummaryDTO> getFumigationApplicationsByStatus(String status, Pageable pageable);
    Page<ClientFumigationApplicationDTO> getClientFumigationApplications(String token, Pageable pageable);
}
