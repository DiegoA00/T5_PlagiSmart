package com.anecacao.api.request.creation.controller;

import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fumigation-applications")
@RequiredArgsConstructor
public class FumigationApplicationController {

    private final FumigationApplicationService fumigationApplicationService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<FumigationApplicationResponseDTO> createFumigationApplication (
            @RequestBody @Valid FumigationApplicationDTO fumigationRequestDTO,
            @RequestHeader("Authorization") String jwt
    ) {
        return new ResponseEntity<>(fumigationApplicationService.createFumigationApplication(fumigationRequestDTO, jwt), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FumigationApplicationResponseDTO> getFumigationApplicationById(@PathVariable Long id,
                                                                                 @RequestHeader("Authorization") String token) {

        FumigationApplicationResponseDTO fumigationApplicationResponseDTO = fumigationApplicationService.getFumigationApplicationById(id, token);

        return ResponseEntity.ok(fumigationApplicationResponseDTO);
    }


}