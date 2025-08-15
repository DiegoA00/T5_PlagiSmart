package com.anecacao.api.reporting.data.dto.response;

import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.reporting.data.dto.FumigationInfoDTO;
import com.anecacao.api.signature.data.dto.SignatureResponse;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class CleanupReportResponseDTO {
    private Long id;
    private String location;
    private String supervisor;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private LotDescriptionResponseDTO lotDescription;
    private IndustrialSafetyConditionsResponseDTO industrialSafetyConditions;
    private List<UserResponseDTO> technicians;
    private FumigationInfoDTO fumigationInfo;
    private List<SignatureResponse> signatures;
}