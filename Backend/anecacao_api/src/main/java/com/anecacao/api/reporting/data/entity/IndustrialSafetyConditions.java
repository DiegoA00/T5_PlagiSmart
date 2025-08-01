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
        return electricDanger || fallingDanger || hitDanger;
    }
}
