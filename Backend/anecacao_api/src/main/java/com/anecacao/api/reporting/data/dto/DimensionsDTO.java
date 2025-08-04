package com.anecacao.api.reporting.data.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DimensionsDTO {
    private BigDecimal height;
    private BigDecimal width;
    private BigDecimal length;
}