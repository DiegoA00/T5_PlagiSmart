package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationDetailDTO {
    private Long id;
    private String lotNumber;
    private String companyName;
    private BigDecimal ton;
    private String representative;
    private String phoneNumber;
    private String location;
    private String plannedDate;
}