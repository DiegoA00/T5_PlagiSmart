package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.Embeddable;

import java.math.BigDecimal;

@Embeddable
public class Dimensions {
    private BigDecimal high;
    private BigDecimal width;
    private BigDecimal length;
}
