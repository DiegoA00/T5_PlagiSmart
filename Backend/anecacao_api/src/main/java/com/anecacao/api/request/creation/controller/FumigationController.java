package com.anecacao.api.request.creation.controller;

import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.FumigationDTO;;
import com.anecacao.api.request.creation.domain.service.FumigationService;
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
    public ResponseEntity<FumigationDTO> updateFumigation(@PathVariable Long fumigationId,
                                                          @RequestBody FumigationDTO fumigationDTO,
                                                          @RequestHeader("Authorization") String token) {

        FumigationDTO updatedFumigationDTO = fumigationService.updateFumigation(fumigationId, fumigationDTO, token);

        return ResponseEntity.ok(updatedFumigationDTO);
    }
}