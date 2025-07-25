package com.anecacao.api.request.creation.controller;

import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationSummaryDTO;
import com.anecacao.api.request.creation.domain.service.FumigationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/approved")
    public ResponseEntity<List<FumigationSummaryDTO>> getApprovedFumigations() {
        List<FumigationSummaryDTO> approvedFumigations = fumigationService.getApprovedFumigations();
        return ResponseEntity.ok(approvedFumigations);
    }

}