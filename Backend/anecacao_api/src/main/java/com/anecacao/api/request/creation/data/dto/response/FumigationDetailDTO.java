package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FumigationDetailDTO {
    private String lotNumber;
    private String companyName;
    private String representative;
    private String phoneNumber;
    private String location;
}