package com.anecacao.api.reporting.data.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LotDescriptionDTO {
    @NotNull(message = "Strips state cannot be null")
    private String stripsState;

    @NotNull(message = "Fumigation time cannot be null")
    @Positive(message = "Fumigation time must be positive")
    private Integer fumigationTime;

    @NotNull
    private BigDecimal ppmFosfina;
}
