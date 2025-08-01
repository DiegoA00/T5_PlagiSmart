package com.anecacao.api.reporting.data.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class IndustrialSafetyConditions {
    private Boolean electricDanger;
    private Boolean fallingDanger;
    private Boolean hitDanger;
    private Boolean otherDanger;

    public boolean hasAnyDanger() {
        return Boolean.TRUE.equals(hitDanger) ||
                Boolean.TRUE.equals(electricDanger) ||
                Boolean.TRUE.equals(fallingDanger) ||
                Boolean.TRUE.equals(otherDanger);
    }
}
