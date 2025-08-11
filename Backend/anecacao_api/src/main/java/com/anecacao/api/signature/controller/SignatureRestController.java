package com.anecacao.api.signature.controller;

import com.anecacao.api.signature.data.dto.SignatureResponse;
import com.anecacao.api.signature.data.dto.SignatureUploadRequest;
import com.anecacao.api.signature.domain.service.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/signatures")
@RequiredArgsConstructor
public class SignatureRestController {
    private final SignatureService signatureService;

    @PostMapping
    public ResponseEntity<SignatureResponse> uploadSignature(@RequestBody SignatureUploadRequest request) {
        try {
            SignatureResponse signature = signatureService.saveSignature(request);
            return ResponseEntity.ok(signature);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
