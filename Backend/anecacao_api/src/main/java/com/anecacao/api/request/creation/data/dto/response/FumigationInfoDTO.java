package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationInfoDTO {
    private CompanyInfoDTO company;
    private LotInfoDTO lot;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CompanyInfoDTO {
        private Long id;
        private String name;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LotInfoDTO {
        private Long id;
        private String lotNumber;
        private BigDecimal tons;
        private String quality;
        private Integer sacks;
        private String portDestination;
    }
}