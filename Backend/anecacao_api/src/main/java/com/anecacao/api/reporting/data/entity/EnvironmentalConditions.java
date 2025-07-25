package com.anecacao.api.reporting.data.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Embeddable
public class EnvironmentalConditions {
    private BigDecimal temperature;
    private BigDecimal humidity;
}
