package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DescarpeResponseDTO {
    private Long id;
    private String company;
    private String location;
    private String date;
    private String startTime;
    private String endTime;
    private String supervisor;
    private List<TechnicianDTO> technicians;
    private List<LotDescriptionDTO> lotDescriptions;
    private EnvironmentalConditionsDTO environmentalConditions;
    private SafetyConditionsDTO safetyConditions;
    private List<SupplyDTO> usedSupplies;
    private SignatureDTO validationSignatures;
    private String observations;
}