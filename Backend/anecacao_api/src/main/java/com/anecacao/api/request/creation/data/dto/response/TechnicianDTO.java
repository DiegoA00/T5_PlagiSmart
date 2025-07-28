package com.anecacao.api.request.creation.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TechnicianDTO {
    private Long id;
    private String nationalId;
    private String firstName;
    private String lastName;
    private String email;
}