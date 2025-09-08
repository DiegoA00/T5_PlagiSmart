package com.anecacao.api.reporting.data.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class LotDescriptionResponseDTO {
    private String stripsState;
    private Integer fumigationTime;
    private BigDecimal ppmFosfina;
}