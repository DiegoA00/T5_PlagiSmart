package com.anecacao.api.reporting.data.dto;

import com.anecacao.api.request.creation.data.entity.PortName;
import com.anecacao.api.request.creation.data.entity.Status;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FumigationInfoDTO {
    private Long id;
    private String lotNumber;
    private BigDecimal ton;
    private String portDestination;
    private Long sacks;
    private String quality;
    private LocalDateTime dateTime;
    private Status status;
    private String message;
}