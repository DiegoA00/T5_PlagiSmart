package com.anecacao.api.signature.data.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignatureUploadRequest {
    private Long fumigationId;
    private Long cleanupId;

    @NotNull
    private String signatureType;

    @NotNull
    private String signatureData;
}
