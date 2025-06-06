package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.repository.FumigationApplicationRepository;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import org.springframework.stereotype.Service;

@Service
public class FumigationApplicationServiceImpl implements FumigationApplicationService {
    @Override
    public void createFumigationApplication(FumigationApplicationDTO fumigationRequestDTO, String jwt) {
    }
    private final FumigationApplicationRepository fumigationApplicationRepository;

    public FumigationApplicationServiceImpl(FumigationApplicationRepository fumigationApplicationRepository) {
        this.fumigationApplicationRepository = fumigationApplicationRepository;
    }
    @Override
    public FumigationApplication getFumigationApplicationById(Long fumigationApplicationId) {
        return fumigationApplicationRepository.findById(fumigationApplicationId)
                .orElseThrow(() -> new RuntimeException("Fumigation Application not found with ID: " + fumigationApplicationId));
    }

}
