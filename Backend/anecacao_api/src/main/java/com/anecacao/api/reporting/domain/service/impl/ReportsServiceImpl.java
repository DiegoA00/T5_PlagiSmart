package com.anecacao.api.reporting.domain.service.impl;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import com.anecacao.api.reporting.data.repository.FumigationReportRepository;
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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements ReportsService {
    private final FumigationRepository fumigationRepository;
    private final FumigationReportRepository fumigationReportRepository;
    private final FumigationApplicationMapper mapper;

    @Transactional
    @Override
    public MessageDTO createFumigationReport(FumigationReportDTO reportDTO) {
        Fumigation fumigation = fumigationRepository.findById(reportDTO.getId())
                .orElseThrow(() -> new FumigationNotFoundException(reportDTO.getId()));

        if (!fumigation.getStatus().equals(Status.APPROVED) && !fumigation.getStatus().equals(Status.FAILED)) {
            throw new InvalidFumigationStatusException(fumigation.getId());
        }

        Optional<FumigationReport> existingReportOpt = fumigationReportRepository.findByFumigationId(fumigation.getId());

        FumigationReport report;
        if (existingReportOpt.isPresent()) {
            report = existingReportOpt.get();
            mapper.updateFumigationReportFromDTO(reportDTO, report);
        } else {
            report = mapper.toFumigationReport(reportDTO);
            report.setFumigation(fumigation);
        }

        report.getSupplies()
                .forEach(
                        supply -> supply.setFumigationReport(report)
                );

        if (reportDTO.getIndustrialSafetyConditions().hasAnyDanger()) {
            fumigation.setStatus(Status.FAILED);
            fumigationRepository.save(fumigation);
            fumigationReportRepository.save(report);
            return null;
        }

        fumigation.setStatus(Status.APPROVED);
        fumigationRepository.save(fumigation);
        fumigationReportRepository.save(report);

        return new MessageDTO("Fumigation report created successfully");
    }
}
