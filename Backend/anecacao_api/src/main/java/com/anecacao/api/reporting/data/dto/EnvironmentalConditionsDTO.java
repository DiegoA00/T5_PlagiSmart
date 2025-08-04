package com.anecacao.api.reporting.data.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class EnvironmentalConditionsDTO {
    private BigDecimal temperature;
    private BigDecimal humidity;
}