package com.anecacao.api.request.creation.data.dto.request;

import com.anecacao.api.request.creation.data.entity.Status;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateStatusRequestDTO {
    @NotNull
    private Status status;
    private String message;
}
