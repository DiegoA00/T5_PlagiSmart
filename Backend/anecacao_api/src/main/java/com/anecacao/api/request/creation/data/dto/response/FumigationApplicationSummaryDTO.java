package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationApplicationSummaryDTO {
    private Long id;
    private String companyName;
    private String representative;
    private String location;
    private String localDate;
    private String status;
    private BigDecimal totalTons;
    private String earlyDate;
}