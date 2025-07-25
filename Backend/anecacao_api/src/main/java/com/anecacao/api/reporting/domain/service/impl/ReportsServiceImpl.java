package com.anecacao.api.reporting.domain.service.impl;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.domain.exception.InvalidFumigationStatusException;
import com.anecacao.api.reporting.domain.service.ReportsService;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements ReportsService {
    private final FumigationRepository fumigationRepository;
    private final FumigationApplicationMapper mapper;

    @Transactional
    @Override
    public MessageDTO createFumigationReport(FumigationReportDTO reportDTO) {
        Fumigation fumigation = fumigationRepository.findById(reportDTO.getId())
                .orElseThrow(() -> new FumigationNotFoundException(reportDTO.getId()));

        if (!fumigation.getStatus().equals(Status.APPROVED) && !fumigation.getStatus().equals(Status.FAILED)) {
            throw new InvalidFumigationStatusException(fumigation.getId());
        }

        mapper.updateFumigationFromReport(reportDTO, fumigation);
        fumigation.getSupplies()
                .forEach(
                        supply -> supply.setFumigation(fumigation)
                );

        if (reportDTO.getIndustrialSafetyConditions().hasAnyDanger()) {
            fumigation.setStatus(Status.FAILED);
            fumigationRepository.save(fumigation);
            return null;
        }

        fumigation.setStatus(Status.APPROVED);
        fumigationRepository.save(fumigation);

        return new MessageDTO("Fumigation report created successfully");
    }
}
