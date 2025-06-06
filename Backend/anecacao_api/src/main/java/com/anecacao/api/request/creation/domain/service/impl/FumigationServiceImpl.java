package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.request.creation.data.dto.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.domain.service.FumigationService;
import org.springframework.stereotype.Service;

@Service
public class FumigationServiceImpl implements FumigationService {

    private final FumigationRepository fumigationRepository;

    public FumigationServiceImpl(FumigationRepository fumigationRepository) {
        this.fumigationRepository = fumigationRepository;
    }

    @Override
    public Fumigation updateFumigation(Long fumigationId, FumigationCreationRequestDTO fumigationDTO) {
        // Buscar la fumigación por ID
        Fumigation fumigation = fumigationRepository.findById(fumigationId)
                .orElseThrow(() -> new RuntimeException("Fumigation not found with ID: " + fumigationId));

        // Actualizar los campos de la fumigación con los datos del DTO
        fumigation.setTon(fumigationDTO.getTon());
        fumigation.setPortDestination(fumigationDTO.getPortDestination());
        fumigation.setSacks(fumigationDTO.getSacks());
        fumigation.setGrade(fumigationDTO.getGrade());
        fumigation.setDateTime(fumigationDTO.getDateTime());

        // Guardar la fumigación actualizada
        return fumigationRepository.save(fumigation);  // `save` también funciona para actualizar
    }

    @Override
    public Fumigation getFumigationById(Long fumigationId) {
        // Buscar la fumigación por su ID
        return fumigationRepository.findById(fumigationId)
                .orElseThrow(() -> new RuntimeException("Fumigation not found with ID: " + fumigationId));
    }

}
