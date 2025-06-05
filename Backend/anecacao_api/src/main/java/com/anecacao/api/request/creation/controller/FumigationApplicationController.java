package com.anecacao.api.request.creation.controller;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
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

    @PostMapping
    public ResponseEntity<MessageDTO> createFumigationApplication (
            @RequestBody @Valid FumigationApplicationDTO fumigationRequestDTO,
            @RequestHeader("Authorization") String jwt
    ) {
        return new ResponseEntity<>(fumigationApplicationService.createFumigationApplication(fumigationRequestDTO, jwt), HttpStatus.CREATED);
    }
}