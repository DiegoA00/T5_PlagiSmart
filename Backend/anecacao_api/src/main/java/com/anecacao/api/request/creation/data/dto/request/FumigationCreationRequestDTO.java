package com.anecacao.api.request.creation.data.dto.request;

import com.anecacao.api.request.creation.data.entity.Grade;
import com.anecacao.api.request.creation.data.entity.PortName;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationCreationRequestDTO {
    @NotNull(message = "Ton must not be null")
    @DecimalMin(value = "0.01", inclusive = true, message = "Ton must be greater than 0")
    private BigDecimal ton;

    @NotNull(message = "Port destination must not be null")
    private PortName portDestination;

    @NotNull(message = "Sacks must not be null")
    @Min(value = 1, message = "Sacks must be at least 1")
    private Long sacks;

    @NotNull(message = "Grade must not be null")
    private Grade grade;

    @NotNull(message = "Date and time must not be null")
    @JsonFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime dateTime;
}