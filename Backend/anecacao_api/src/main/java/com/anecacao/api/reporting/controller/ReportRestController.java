package com.anecacao.api.reporting.controller;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.CleanupReportDTO;
import com.anecacao.api.reporting.data.dto.response.CertificateDTO;
import com.anecacao.api.reporting.data.dto.response.CleanupReportResponseDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.data.dto.response.FumigationReportResponseDTO;
import com.anecacao.api.reporting.domain.exception.IndustrialSafetyViolationException;
import com.anecacao.api.reporting.domain.service.ReportsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportRestController {
    private final ReportsService reportsService;

    @GetMapping("/fumigations")
    public ResponseEntity<Page<FumigationReportResponseDTO>> getAllFumigationReports(Pageable pageable) {
        Page<FumigationReportResponseDTO> reports = reportsService.getAllFumigationReports(pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/fumigations/all")
    public ResponseEntity<List<FumigationReportResponseDTO>> getAllFumigationReportsNoPagination() {
        return ResponseEntity.ok(reportsService.getAllFumigationReportsNoPagination());
    }

    @GetMapping("/fumigations/by-fumigation/{fumigationId}")
    public ResponseEntity<FumigationReportResponseDTO> getFumigationReportByFumigationId(@PathVariable Long fumigationId) {
        return ResponseEntity.ok(reportsService.getFumigationReportByFumigationId(fumigationId));
    }

    @GetMapping("/fumigations/{id}")
    public ResponseEntity<FumigationReportResponseDTO> getFumigationReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportsService.getFumigationReportById(id));
    }

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

    @GetMapping("/cleanup")
    public ResponseEntity<Page<CleanupReportResponseDTO>> getAllCleanupReports(Pageable pageable) {
        Page<CleanupReportResponseDTO> reports = reportsService.getAllCleanupReports(pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/cleanup/all")
    public ResponseEntity<List<CleanupReportResponseDTO>> getAllCleanupReportsNoPagination() {
        return ResponseEntity.ok(reportsService.getAllCleanupReportsNoPagination());
    }

    @GetMapping("/cleanup/by-fumigation/{fumigationId}")
    public ResponseEntity<CleanupReportResponseDTO> getCleanupReportByFumigationId(@PathVariable Long fumigationId) {
        return ResponseEntity.ok(reportsService.getCleanupReportByFumigationId(fumigationId));
    }

    @GetMapping("/cleanup/{id}")
    public ResponseEntity<CleanupReportResponseDTO> getCleanupReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportsService.getCleanupReportById(id));
    }

    @PostMapping("/cleanup")
    public ResponseEntity<MessageDTO> createCleanupReport (
            @RequestBody @Valid CleanupReportDTO reportDTO
    ) {
        MessageDTO message = reportsService.createCleanupReport(reportDTO);

        if (message == null) throw new IndustrialSafetyViolationException(reportDTO.getId());

        return new ResponseEntity<>(
                message,
                HttpStatus.CREATED
        );
    }

    /**
     * Obtiene el certificado de fumigación para una fumigación específica.
     * Solo disponible para fumigaciones en estado FINISHED.
     *
     * @param fumigationId ID de la fumigación
     * @return CertificateDTO con todos los datos del certificado
     */
    @GetMapping("/certificate/by-fumigation/{fumigationId}")
    public ResponseEntity<CertificateDTO> getCertificateByFumigationId(@PathVariable Long fumigationId) {
        CertificateDTO certificate = reportsService.getCertificateByFumigationId(fumigationId);
        return ResponseEntity.ok(certificate);
    }
}
