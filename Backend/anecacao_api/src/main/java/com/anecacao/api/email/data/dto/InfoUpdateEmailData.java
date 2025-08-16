package com.anecacao.api.email.data.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Data
public class InfoUpdateEmailData {
    private String lotNumber;
    private String clientName;
    private BigDecimal previousTons;
    private double newTons;
    private String previousPort;
    private String newPort;
    private LocalDate previousDate;
    private LocalDate newDate;
    private Long previousSacks;
    private Long newSacks;
    private String recipientEmail;

}
