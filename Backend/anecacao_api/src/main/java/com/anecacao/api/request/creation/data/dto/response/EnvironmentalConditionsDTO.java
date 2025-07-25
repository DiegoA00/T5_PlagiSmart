package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnvironmentalConditionsDTO {
    private BigDecimal temperature;
    private BigDecimal humidity;
    private String windConditions;
    private String weatherConditions;
}