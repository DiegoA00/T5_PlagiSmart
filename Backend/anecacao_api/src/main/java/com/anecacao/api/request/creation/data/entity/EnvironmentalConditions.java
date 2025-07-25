package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.Embeddable;

import java.math.BigDecimal;

@Embeddable
public class EnvironmentalConditions {
    private BigDecimal temperature;
    private BigDecimal humidity;
}
