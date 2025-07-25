package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Embeddable
public class Dimensions {
    private BigDecimal height;
    private BigDecimal width;
    private BigDecimal length;
}
