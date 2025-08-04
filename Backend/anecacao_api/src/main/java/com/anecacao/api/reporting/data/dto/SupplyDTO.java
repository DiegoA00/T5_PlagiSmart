package com.anecacao.api.reporting.data.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SupplyDTO {
    private Long id;
    private String name;
    private BigDecimal quantity;
    private String dosage;
    private String kindOfSupply;
    private String numberOfStrips;
}