package com.anecacao.api.request.creation.data.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyRequestDTO {
    @NotNull(message = "Company ID must not be null")
    private Long id;
}
