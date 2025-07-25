package com.anecacao.api.reporting.data.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class IndustrialSafetyConditions {
    private boolean electricDanger;
    private boolean fallingDanger;
    private boolean hitDanger;

    public boolean hasAnyDanger() {
        return electricDanger || fallingDanger || hitDanger;
    }
}
