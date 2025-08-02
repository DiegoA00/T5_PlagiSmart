package com.anecacao.api.reporting.controller;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.CleanupReportDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.domain.exception.IndustrialSafetyViolationException;
import com.anecacao.api.reporting.domain.service.ReportsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Create a fumigation report", description = "Creates a new fumigation report based on the given data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping("/fumigations")
    public ResponseEntity<MessageDTO> createFumigationReport(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Fumigation Report JSON",
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    example = """
                {
                    "id": 1,
                    "location": "Warehouse A",
                    "date": "11-11-2025",
                    "startTime": "14:00",
                    "endTime": "23:00",
                    "technicians": [
                        { "id": 3 }
                    ],
                    "supplies": [
                        {
                            "name": "Fumigant X",
                            "quantity": 12.5,
                            "dosage": "5ml/m2",
                            "kindOfSupply": "Gas",
                            "numberOfStrips": "2"
                        },
                        {
                            "name": "Fumigant XYYYY",
                            "quantity": 122.5,
                            "dosage": "511ml/m2",
                            "kindOfSupply": "GaSSSs",
                            "numberOfStrips": "32"
                        }
                    ],
                    "dimensions": {
                        "height": 3.5,
                        "width": 5.0,
                        "length": 10.0
                    },
                    "environmentalConditions": {
                        "temperature": 28.0,
                        "humidity": 60.0
                    },
                    "industrialSafetyConditions": {
                        "electricDanger": false,
                        "fallingDanger": false,
                        "hitDanger": false
                    },
                    "observations": ""
                }
                """
                            )
                    )
            )
            @RequestBody @Valid FumigationReportDTO reportDTO
            ) {

        MessageDTO message = reportsService.createFumigationReport(reportDTO);

        if (message == null) throw new IndustrialSafetyViolationException(reportDTO.getId());

        return new ResponseEntity<>(
                message,
                HttpStatus.CREATED);
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
}
