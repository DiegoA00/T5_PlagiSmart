package com.anecacao.api.reporting.data.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SimpleUserDTO {
    @NotNull
    private Long id;
}
