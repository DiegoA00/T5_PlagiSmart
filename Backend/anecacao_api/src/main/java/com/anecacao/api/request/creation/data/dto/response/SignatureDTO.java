package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignatureDTO {
    private Long id;
    private String signerName;
    private String signerRole;
    private LocalDateTime signedAt;
    private String signatureData;
}