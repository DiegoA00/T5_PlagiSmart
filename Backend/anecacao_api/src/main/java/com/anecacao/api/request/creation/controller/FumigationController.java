package com.anecacao.api.request.creation.controller;

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

    @PutMapping("/{fumigationId}")
    public ResponseEntity<FumigationResponseDTO> updateFumigation(@PathVariable Long fumigationId,
                                                          @RequestBody @Valid FumigationDTO fumigationDTO,
                                                          @RequestHeader("Authorization") String token) {

        FumigationResponseDTO updatedFumigationResponseDTO = fumigationService.updateFumigation(fumigationId, fumigationDTO, token);

        return ResponseEntity.ok(updatedFumigationResponseDTO);
    }
}