package com.anecacao.api.reporting.controller;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.domain.exception.IndustrialSafetyViolationException;
import com.anecacao.api.reporting.domain.service.ReportsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportRestController {
    private final ReportsService reportsService;

    @PostMapping("/fumigations")
    public ResponseEntity<MessageDTO> createFumigationReport(
            @RequestBody @Valid FumigationReportDTO reportDTO
            ) {

        MessageDTO message = reportsService.createFumigationReport(reportDTO);

        if (message == null) throw new IndustrialSafetyViolationException(reportDTO.getId());

        return new ResponseEntity<>(
                message,
                HttpStatus.CREATED);
    }
}
