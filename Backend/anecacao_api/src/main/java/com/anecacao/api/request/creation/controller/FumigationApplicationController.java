package com.anecacao.api.request.creation.controller;

import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.domain.service.FumigationApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fumigation-applications")
@RequiredArgsConstructor
public class FumigationApplicationController {

    private final FumigationApplicationService fumigationApplicationService;
    private final UserService userService;

    @PostMapping
    public void createFumigationApplication (
            @RequestBody @Valid FumigationApplicationDTO fumigationRequestDTO,
            @RequestHeader("Authorization") String jwt
    ) {
        fumigationApplicationService.createFumigationApplication(fumigationRequestDTO, jwt);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FumigationApplication> getFumigationApplicationById(@PathVariable Long id,
                                                                              @RequestHeader("Authorization") String token) {
        FumigationApplication fumigationApplication = fumigationApplicationService.getFumigationApplicationById(id);

        String userIdFromToken = userService.getUserReferenceById(token).getId().toString();

        Long companyOwnerId = fumigationApplication.getCompany().getLegalRepresentative().getId();

        boolean isAuthorized = userIdFromToken.equals(companyOwnerId.toString()) || userService.hasRole(userIdFromToken, "ROLE_ADMIN");

        if (!isAuthorized) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(fumigationApplication);

    }

}