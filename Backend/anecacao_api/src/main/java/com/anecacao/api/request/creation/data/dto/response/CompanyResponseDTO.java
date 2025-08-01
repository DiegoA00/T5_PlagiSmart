package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompanyResponseDTO {
    private Long id;
    private String name;
    private String businessName;
    private String phoneNumber;
    private String ruc;
    private String address;
    private UserResponseDTO legalRepresentative;
}
