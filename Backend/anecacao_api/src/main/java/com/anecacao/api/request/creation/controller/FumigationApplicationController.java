package com.anecacao.api.request.creation.controller;

import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.ClientFumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationSummaryDTO;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fumigation-applications")
@RequiredArgsConstructor
public class FumigationApplicationController {
    private final FumigationApplicationService fumigationApplicationService;

    @PostMapping
    public ResponseEntity<FumigationApplicationResponseDTO> createFumigationApplication (
            @RequestBody @Valid FumigationApplicationDTO fumigationRequestDTO,
            @RequestHeader("Authorization") String jwt
    ) {
        return new ResponseEntity<>(fumigationApplicationService.createFumigationApplication(fumigationRequestDTO, jwt), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FumigationApplicationResponseDTO> getFumigationApplicationById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {

        FumigationApplicationResponseDTO fumigationApplicationResponseDTO = fumigationApplicationService.getFumigationApplicationById(id, token);
        return ResponseEntity.ok(fumigationApplicationResponseDTO);
    }

    @GetMapping
    public ResponseEntity<Page<FumigationApplicationSummaryDTO>> getFumigationApplicationsByStatus(
            @RequestParam(name = "status", required = true) String status,
            Pageable pageable
    ) {
        Page<FumigationApplicationSummaryDTO> applications = fumigationApplicationService.getFumigationApplicationsByStatus(status, pageable);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<Page<ClientFumigationApplicationDTO>> getMyFumigationApplications(
            @RequestHeader("Authorization") String token,
            Pageable pageable
    ) {
        Page<ClientFumigationApplicationDTO> applications = fumigationApplicationService.getClientFumigationApplications(token, pageable);
        return ResponseEntity.ok(applications);
    }
}