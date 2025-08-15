package com.anecacao.api.reporting.data.dto;

import com.anecacao.api.reporting.data.entity.IndustrialSafetyConditions;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class CleanupReportDTO {
    @NotNull(message = "Fumigation ID must not be null")
    private Long id;

    @NotNull(message = "Supervisor must not be null")
    private String supervisor;

    @NotNull(message = "Location must not be null")
    private String location;

    @NotNull(message = "Date must not be null")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate date;

    @NotNull(message = "Start time must not be null")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @NotNull(message = "End time must not be null")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    @NotEmpty(message = "At least one technician is required")
    private List<SimpleUserDTO> technicians;

    @NotNull(message = "Lot description cannot be null")
    private LotDescriptionDTO lotDescription;

    @NotNull(message = "Industrial safety conditions must not be null")
    private IndustrialSafetyConditions industrialSafetyConditions;
}
