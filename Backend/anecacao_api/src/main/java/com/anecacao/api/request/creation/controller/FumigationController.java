package com.anecacao.api.request.creation.controller;

import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
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
    public ResponseEntity<Fumigation> updateFumigation(@PathVariable Long fumigationId,
                                                       @RequestBody FumigationCreationRequestDTO fumigationDTO,
                                                       @RequestHeader("Authorization") String token) {

        Fumigation fumigation = fumigationService.getFumigationById(fumigationId);

        String userIdFromToken = userService.getUserReferenceById(token).getId().toString();

        FumigationApplication fumigationApplication = fumigation.getFumigationApplication();

        Long companyOwnerId = fumigationApplication.getCompany().getLegalRepresentative().getId();

        boolean isAuthorized = userIdFromToken.equals(companyOwnerId.toString()) || userService.hasRole(userIdFromToken, "ROLE_ADMIN");

        if (!isAuthorized) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        Fumigation updatedFumigation = fumigationService.updateFumigation(fumigationId, fumigationDTO);
        return ResponseEntity.ok(updatedFumigation);
    }
}