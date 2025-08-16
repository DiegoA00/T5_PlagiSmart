package com.anecacao.api.email.data.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class EmailRequestData {
    private Long requestId;
    private String clientName;
    private String companyName;
    private String companyRuc;
    private LocalDate requestDate;
    private int lotCount;
    private double totalTons;
    private String recipientEmail;
}
