package com.anecacao.api.reporting.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.*;
import com.anecacao.api.reporting.data.dto.response.CleanupReportResponseDTO;
import com.anecacao.api.reporting.data.dto.response.FumigationReportResponseDTO;
import com.anecacao.api.reporting.data.entity.CleanupReport;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import com.anecacao.api.reporting.data.entity.IndustrialSafetyConditions;
import com.anecacao.api.reporting.data.mapper.CleanupReportMapper;
import com.anecacao.api.reporting.data.mapper.FumigationReportMapper;
import com.anecacao.api.reporting.data.repository.CleanupReportRepository;
import com.anecacao.api.reporting.data.repository.FumigationReportRepository;
import com.anecacao.api.reporting.domain.exception.InvalidFumigationStatusException;
import com.anecacao.api.reporting.domain.service.ReportsService;
import com.anecacao.api.reporting.domain.service.exception.CleanupReportNotFoundException;
import com.anecacao.api.reporting.domain.service.exception.FumigationReportNotFoundException;
import com.anecacao.api.reporting.domain.service.exception.TechnicalRoleException;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportsServiceImpl implements ReportsService {
    private final FumigationRepository fumigationRepository;
    private final FumigationReportRepository fumigationReportRepository;
    private final CleanupReportRepository cleanupReportRepository;
    private final UserService userService;
    private final FumigationApplicationMapper mapper;
    private final FumigationReportMapper fumigationReportMapper;
    private final CleanupReportMapper cleanupReportMapper;

    @Transactional
    @Override
    public MessageDTO createFumigationReport(FumigationReportDTO reportDTO) {
        Fumigation fumigation = getValidFumigation(reportDTO.getId());

        checkTechniciansRole(reportDTO.getTechnicians());

        FumigationReport report = getOrCreateFumigationReport(reportDTO, fumigation);
        linkSupplies(report);

        IndustrialSafetyConditionsDTO conditionsDTO = reportDTO.getIndustrialSafetyConditions();

        return processReportAndUpdateStatus(mapper.toConditionEntity(conditionsDTO), fumigation, report, true);
    }

    @Override
    public MessageDTO createCleanupReport(CleanupReportDTO reportDTO) {
        Fumigation fumigation = getValidFumigation(reportDTO.getId());

        checkTechniciansRole(reportDTO.getTechnicians());

        CleanupReport report = getOrCreateCleanupReport(reportDTO, fumigation);

        return processReportAndUpdateStatus(reportDTO.getIndustrialSafetyConditions(), fumigation, report, false);
    }

    private void checkTechniciansRole(List<SimpleUserDTO> technicians) {
        technicians.forEach(t -> {
            if (!userService.hasRole(t.getId().toString(), RoleName.ROLE_TECHNICIAN)) {
                throw new TechnicalRoleException(t.getId().toString());
            }
        });
    }

    private IndustrialSafetyConditions toConditionEntity (IndustrialSafetyConditionsDTO conditionsDTO) {
        IndustrialSafetyConditions conditions = new IndustrialSafetyConditions();
        conditions.setHitDanger(conditionsDTO.isHitDanger());
        conditions.setElectricDanger(conditionsDTO.isElectricDanger());
        conditions.setFallingDanger(conditionsDTO.isFallingDanger());
        conditions.setOtherDanger(false);
        return conditions;
    }

    private Fumigation getValidFumigation(Long id) {
        Fumigation fumigation = fumigationRepository.findById(id)
                .orElseThrow(() -> new FumigationNotFoundException(id));

        if (!fumigation.getStatus().equals(Status.APPROVED) && !fumigation.getStatus().equals(Status.FAILED)) {
            throw new InvalidFumigationStatusException(id);
        }

        return fumigation;
    }

    private FumigationReport getOrCreateFumigationReport(FumigationReportDTO dto, Fumigation fumigation) {
        return fumigationReportRepository.findByFumigationId(fumigation.getId())
                .map(existing -> {
                    mapper.updateFumigationReportFromDTO(dto, existing);
                    return existing;
                })
                .orElseGet(() -> {
                    FumigationReport newReport = mapper.toFumigationReport(dto);
                    newReport.setFumigation(fumigation);
                    return newReport;
                });
    }

    private CleanupReport getOrCreateCleanupReport(CleanupReportDTO dto, Fumigation fumigation) {
        return cleanupReportRepository.findByFumigationId(fumigation.getId())
                .map(existing -> {
                    mapper.updateCleanupReportFromDTO(dto, existing);
                    return existing;
                })
                .orElseGet(() -> {
                    CleanupReport newReport = mapper.toCleanupReport(dto);
                    newReport.setFumigation(fumigation);
                    return newReport;
                });
    }

    private void linkSupplies(FumigationReport report) {
        report.getSupplies().forEach(supply -> supply.setFumigationReport(report));
    }

    private MessageDTO processReportAndUpdateStatus(IndustrialSafetyConditions conditions,
                                                    Fumigation fumigation,
                                                    Object report,
                                                    boolean isFumigationReport) {
        if (conditions.hasAnyDanger()) {
            fumigation.setStatus(Status.FAILED);
        } else {
            fumigation.setStatus(Status.APPROVED);
        }

        fumigationRepository.save(fumigation);

        if (isFumigationReport) {
            fumigationReportRepository.save((FumigationReport) report);
        } else {
            cleanupReportRepository.save((CleanupReport) report);
        }

        return conditions.hasAnyDanger() ? null : new MessageDTO("Fumigation report created successfully");
    }

    @Transactional
    @Override
    public FumigationReportResponseDTO getFumigationReportByFumigationId(Long fumigationId) {
        FumigationReport report = fumigationReportRepository.findByFumigationId(fumigationId)
                .orElseThrow(() -> new FumigationReportNotFoundException("No report found for fumigation ID: " + fumigationId));
        return fumigationReportMapper.toResponseDTO(report);
    }

    @Override
    public Page<FumigationReportResponseDTO> getAllFumigationReports(Pageable pageable) {
        Page<FumigationReport> reportPage = fumigationReportRepository.findAll(pageable);
        return reportPage.map(fumigationReportMapper::toResponseDTO);
    }

    @Override
    public List<FumigationReportResponseDTO> getAllFumigationReportsNoPagination() {
        List<FumigationReport> reports = fumigationReportRepository.findAll();
        return fumigationReportMapper.toResponseDTOList(reports);
    }

    @Override
    public FumigationReportResponseDTO getFumigationReportById(Long id) {
        FumigationReport report = fumigationReportRepository.findById(id)
                .orElseThrow(() -> new FumigationReportNotFoundException(id));
        return fumigationReportMapper.toResponseDTO(report);
    }

    @Override
    public Page<CleanupReportResponseDTO> getAllCleanupReports(Pageable pageable) {
        Page<CleanupReport> reportPage = cleanupReportRepository.findAll(pageable);
        return reportPage.map(cleanupReportMapper::toResponseDTO);
    }

    @Override
    public List<CleanupReportResponseDTO> getAllCleanupReportsNoPagination() {
        List<CleanupReport> reports = cleanupReportRepository.findAll();
        return cleanupReportMapper.toResponseDTOList(reports);
    }

    @Override
    public CleanupReportResponseDTO getCleanupReportById(Long id) {
        CleanupReport report = cleanupReportRepository.findById(id)
                .orElseThrow(() -> new CleanupReportNotFoundException(id));
        return cleanupReportMapper.toResponseDTO(report);
    }

    @Override
    public CleanupReportResponseDTO getCleanupReportByFumigationId(Long fumigationId) {
        CleanupReport report = cleanupReportRepository.findByFumigationId(fumigationId)
                .orElseThrow(() -> new CleanupReportNotFoundException("No cleanup report found for fumigation ID: " + fumigationId));
        return cleanupReportMapper.toResponseDTO(report);
    }
}
