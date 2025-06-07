package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationApplicationResponseDTO {
    private Long id;
    private CompanyResponseDTO company;
    private List<FumigationResponseDTO> fumigations;
}