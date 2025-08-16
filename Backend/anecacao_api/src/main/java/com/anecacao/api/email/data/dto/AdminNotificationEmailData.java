package com.anecacao.api.email.data.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdminNotificationEmailData {
    private Long requestId;
    private String companyName;
    private String companyRuc;
    private String legalRepresentative;
    private String contactEmail;
    private String contactPhone;
    private int lotCount;
    private double totalTons;
    private String priority;
    private String recipientEmail;
    private List<LotDetail> lotDetails;

    @Data
    public static class LotDetail {
        private String lotNumber;
        private double tons;
        private Long sacks;
        private String port;
    }
}
