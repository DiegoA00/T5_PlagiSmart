package com.anecacao.api.reporting.data.dto.response;

import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.reporting.data.dto.*;
import com.anecacao.api.signature.data.dto.SignatureResponse;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class FumigationReportResponseDTO {
    private Long id;
    private String supervisor;
    private String location;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String observations;
    private DimensionsDTO dimensions;
    private EnvironmentalConditionsDTO environmentalConditions;
    private IndustrialSafetyConditionsDTO industrialSafetyConditions;
    private List<UserResponseDTO> technicians;
    private List<SupplyDTO> supplies;
    private FumigationInfoDTO fumigationInfo;
    private List<SignatureResponse> signatures;
}