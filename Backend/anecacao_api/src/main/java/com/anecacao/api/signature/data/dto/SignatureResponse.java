package com.anecacao.api.signature.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignatureResponse {
    private Long id;
    private String signatureType;
    private String fileUrl;
    private Long reportId;
}
