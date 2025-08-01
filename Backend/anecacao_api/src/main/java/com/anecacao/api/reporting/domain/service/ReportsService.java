package com.anecacao.api.reporting.domain.service;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;

public interface ReportsService {
    MessageDTO createFumigationReport(FumigationReportDTO reportDTO);
}
