package com.anecacao.api.request.creation.data.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationApplicationDTO {
    @NotNull(message = "Company must not be null")
    @Valid
    private CompanyRequestDTO company;

    @NotEmpty(message = "Fumigation list must not be empty")
    @Valid
    private List<FumigationCreationRequestDTO> fumigations;
}