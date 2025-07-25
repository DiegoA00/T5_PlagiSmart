package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class IndustrialSafetyConditions {
    private boolean electricDanger;
    private boolean fallingDanger;
    private boolean hitDanger;
}
