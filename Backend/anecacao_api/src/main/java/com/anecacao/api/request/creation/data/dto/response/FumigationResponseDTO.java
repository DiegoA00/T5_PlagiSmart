package com.anecacao.api.request.creation.data.dto.response;

import com.anecacao.api.request.creation.data.entity.PortName;
import com.anecacao.api.request.creation.data.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationResponseDTO {
    private Long id;
    private String lotNumber;
    private BigDecimal ton;
    private PortName portDestination;
    private Long sacks;
    private String quality;
    private Status status;
    private String message;
    private LocalDateTime dateTime;
}
