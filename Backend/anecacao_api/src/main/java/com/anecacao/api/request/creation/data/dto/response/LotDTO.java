package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LotDTO {
    private String lotNumber;
    private BigDecimal tons;
    private String quality;
    private Integer bags;
    private String destination;
}