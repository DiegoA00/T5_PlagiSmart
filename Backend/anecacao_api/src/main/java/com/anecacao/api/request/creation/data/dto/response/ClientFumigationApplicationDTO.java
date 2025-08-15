package com.anecacao.api.request.creation.data.dto.response;

import com.anecacao.api.request.creation.data.dto.response.CompanyResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientFumigationApplicationDTO {
    private Long id;
    private CompanyResponseDTO company;
    private LocalDate createdAt;
    private BigDecimal totalTons;
    private String earlyDate;
    private List<FumigationResponseDTO> fumigations;
}
