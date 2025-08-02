package com.anecacao.api.reporting.data.dto;

import lombok.Data;

@Data
public class IndustrialSafetyConditionsDTO {
    private boolean electricDanger;
    private boolean fallingDanger;
    private boolean hitDanger;

    public boolean hasAnyDanger() {
        return electricDanger || fallingDanger || hitDanger;
    }
}
