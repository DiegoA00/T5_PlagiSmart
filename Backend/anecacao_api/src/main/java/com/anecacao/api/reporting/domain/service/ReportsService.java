package com.anecacao.api.reporting.domain.service;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.CleanupReportDTO;
import com.anecacao.api.reporting.data.dto.response.CleanupReportResponseDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.data.dto.response.FumigationReportResponseDTO;
import com.anecacao.api.reporting.data.dto.response.PageResponseDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReportsService {
    MessageDTO createFumigationReport(FumigationReportDTO reportDTO);

    MessageDTO createCleanupReport(CleanupReportDTO reportDTO);

    PageResponseDTO<FumigationReportResponseDTO> getAllFumigationReports(Pageable pageable);

    List<FumigationReportResponseDTO> getAllFumigationReportsNoPagination();

    FumigationReportResponseDTO getFumigationReportById(Long id);

    FumigationReportResponseDTO getFumigationReportByFumigationId(Long fumigationId);

    PageResponseDTO<CleanupReportResponseDTO> getAllCleanupReports(Pageable pageable);

    List<CleanupReportResponseDTO> getAllCleanupReportsNoPagination();

    CleanupReportResponseDTO getCleanupReportById(Long id);

    CleanupReportResponseDTO getCleanupReportByFumigationId(Long fumigationId);
}
