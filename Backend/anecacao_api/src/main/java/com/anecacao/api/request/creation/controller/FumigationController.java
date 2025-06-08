package com.anecacao.api.request.creation.controller;

import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.FumigationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
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
    private final UserService userService;
  
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateFumigationStatus (
            @PathVariable Long id,
            @RequestBody @Valid UpdateStatusRequestDTO updateStatusRequestDTO
    ) {
        fumigationService.updateFumigationStatus (id, updateStatusRequestDTO);
        return ResponseEntity.noContent().build();

    @PutMapping("/{id}")
    public ResponseEntity<FumigationResponseDTO> updateFumigation(@PathVariable Long id,
                                                          @RequestBody @Valid FumigationDTO fumigationDTO,
                                                          @RequestHeader("Authorization") String token) {

        FumigationResponseDTO updatedFumigationResponseDTO = fumigationService.updateFumigation(id, fumigationDTO, token);

        return ResponseEntity.ok(updatedFumigationResponseDTO);
    }
}