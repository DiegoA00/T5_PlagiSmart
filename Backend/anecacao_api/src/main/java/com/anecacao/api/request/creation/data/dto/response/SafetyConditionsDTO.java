package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SafetyConditionsDTO {
    private Boolean personalProtectiveEquipment;
    private Boolean signage;
    private Boolean perimeterSecurity;
    private String additionalMeasures;
}