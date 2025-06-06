package com.anecacao.api.request.creation.controller;

import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.domain.service.FumigationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fumigations")
@RequiredArgsConstructor
public class FumigationController {
    private final FumigationService fumigationService;

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateFumigationStatus (
            @PathVariable Long id,
            @RequestBody @Valid UpdateStatusRequestDTO updateStatusRequestDTO
    ) {
        fumigationService.updateFumigationStatus (id, updateStatusRequestDTO);
        return ResponseEntity.noContent().build();
    }
}