package com.anecacao.api.email.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class StatusUpdateEmailData {
    private String lotNumber;
    private String clientName;
    private String previousStatus;
    private String currentStatus;
    private LocalDate updateDate;
    private String reason;
    private String recipientEmail;
}
