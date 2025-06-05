package com.anecacao.api.request.creation.controller;

import com.anecacao.api.request.creation.domain.service.FumigationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fumigations")
@RequiredArgsConstructor
public class FumigationController {
    private final FumigationService fumigationService;
}