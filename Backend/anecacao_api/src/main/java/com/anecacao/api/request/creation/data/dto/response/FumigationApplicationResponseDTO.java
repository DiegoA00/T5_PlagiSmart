package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationApplicationResponseDTO {
    private Long id;
    private CompanyResponseDTO company;
    private LocalDate createdAt;
    private List<FumigationResponseDTO> fumigations;
}
