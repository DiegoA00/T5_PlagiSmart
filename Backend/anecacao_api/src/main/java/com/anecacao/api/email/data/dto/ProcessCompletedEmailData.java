package com.anecacao.api.email.data.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ProcessCompletedEmailData {
    private String lotNumber;
    private String clientName;
    private double processedTons;
    private String recipientEmail;
}
