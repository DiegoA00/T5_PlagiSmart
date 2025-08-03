package com.anecacao.api.reporting.data.dto.response;

import lombok.Data;

@Data
public class IndustrialSafetyConditionsResponseDTO {
    private boolean electricDanger;
    private boolean fallingDanger;
    private boolean hitDanger;
    private boolean otherDanger;

    public boolean hasAnyDanger() {
        return electricDanger || fallingDanger || hitDanger || otherDanger;
    }
}