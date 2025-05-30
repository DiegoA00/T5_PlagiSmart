package com.anecacao.authentication.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    private String nationalId;

    private String firstName;

    private String lastName;

    private String email;

    private String role;

    private String location;
}