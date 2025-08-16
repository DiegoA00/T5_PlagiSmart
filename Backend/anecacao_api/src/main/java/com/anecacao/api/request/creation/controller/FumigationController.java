package com.anecacao.api.request.creation.controller;

import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.response.FumigationDetailDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationInfoDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.domain.service.FumigationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fumigations")
@RequiredArgsConstructor
public class FumigationController {
    private final FumigationService fumigationService;
    private final UserService userService;
  
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateFumigationStatus (
            @PathVariable Long id,
            @RequestBody @Valid UpdateStatusRequestDTO updateStatusRequestDTO
    ) {
        fumigationService.updateFumigationStatus(id, updateStatusRequestDTO);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<FumigationResponseDTO> updateFumigation(
            @PathVariable Long id,
            @RequestBody @Valid FumigationCreationRequestDTO fumigationDTO,
            @RequestHeader("Authorization") String token
    ) {
        FumigationResponseDTO updatedFumigationResponseDTO = fumigationService.updateFumigation(id, fumigationDTO, token);
        return ResponseEntity.ok(updatedFumigationResponseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FumigationResponseDTO> getFumigationById (
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        return ResponseEntity.ok(fumigationService.getFumigationById(id, token));
    }

    @GetMapping("/info/{id}")
    public ResponseEntity<FumigationInfoDTO> getFumigationInfo(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        FumigationInfoDTO fumigationInfo = fumigationService.getFumigationInfo(id, token);
        return ResponseEntity.ok(fumigationInfo);
    }

    @GetMapping
    public ResponseEntity<Page<FumigationDetailDTO>> getFumigationsByStatus(
            @RequestParam(name = "status") String status,
            @RequestHeader("Authorization") String token,
            Pageable pageable
    ) {
        Page<FumigationDetailDTO> fumigations = fumigationService.getFumigationsByStatus(status, token, pageable);
        return ResponseEntity.ok(fumigations);
    }
}