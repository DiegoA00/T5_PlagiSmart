package com.anecacao.api.signature.domain.service.impl;

import com.anecacao.api.reporting.data.entity.CleanupReport;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import com.anecacao.api.reporting.data.repository.CleanupReportRepository;
import com.anecacao.api.reporting.data.repository.FumigationReportRepository;
import com.anecacao.api.signature.data.dto.SignatureResponse;
import com.anecacao.api.signature.data.dto.SignatureUploadRequest;
import com.anecacao.api.signature.data.entity.Signature;
import com.anecacao.api.signature.data.repository.SignatureRepository;
import com.anecacao.api.signature.domain.service.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SignatureServiceImpl implements SignatureService {
    @Value("${app.upload.dir}")
    private String uploadDir;

    private final SignatureRepository signatureRepository;
    private final FumigationReportRepository fumigationReportRepository;
    private final CleanupReportRepository cleanupReportRepository;

    private static final Set<String> VALID_SIGNATURE_TYPES = Set.of("technician", "client");

    @Override
    public SignatureResponse saveSignature(SignatureUploadRequest request) throws IOException {
        if (request.getFumigationId() == null && request.getCleanupId() == null) {
            throw new IllegalArgumentException("FumigationId or CleanupId is required");
        }

        if (!VALID_SIGNATURE_TYPES.contains(request.getSignatureType().toLowerCase())) {
            throw new IllegalArgumentException("Invalid signatureType. Must be 'technician' or 'client'");
        }

        Optional<Signature> existingSignature;
        if (request.getFumigationId() != null) {
            existingSignature = signatureRepository
                    .findByFumigationReportIdAndSignatureType(request.getFumigationId(), request.getSignatureType());
        } else {
            existingSignature = signatureRepository
                    .findByCleanupReportIdAndSignatureType(request.getCleanupId(), request.getSignatureType());
        }

        byte[] imageBytes = decodeBase64Image(request.getSignatureData());
        String fileName = UUID.randomUUID() + ".jpg";
        Path filePath = Paths.get(uploadDir, fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, imageBytes);

        Signature signature;
        if (existingSignature.isPresent()) {
            signature = existingSignature.get();

            if (signature.getFilePath() != null) {
                Path oldFilePath = Paths.get(uploadDir, Paths.get(signature.getFilePath()).getFileName().toString());
                Files.deleteIfExists(oldFilePath);
            }

            signature.setFilePath("/uploads/signatures/" + fileName);
        } else {
            signature = new Signature();
            signature.setSignatureType(request.getSignatureType());
            signature.setFilePath("/uploads/signatures/" + fileName);

            if (request.getFumigationId() != null) {
                FumigationReport fumigationReport = fumigationReportRepository
                        .findById(request.getFumigationId())
                        .orElseThrow(() -> new IllegalArgumentException("FumigationReport not found"));
                signature.setFumigationReport(fumigationReport);
            } else {
                CleanupReport cleanupReport = cleanupReportRepository
                        .findById(request.getCleanupId())
                        .orElseThrow(() -> new IllegalArgumentException("CleanupReport not found"));
                signature.setCleanupReport(cleanupReport);
            }
        }

        Signature saved = signatureRepository.save(signature);

        Long reportId = saved.getFumigationReport() != null
                ? saved.getFumigationReport().getId()
                : saved.getCleanupReport() != null
                ? saved.getCleanupReport().getId()
                : null;

        return new SignatureResponse(
                saved.getId(),
                saved.getSignatureType(),
                saved.getFilePath(),
                reportId
        );
    }

    private byte[] decodeBase64Image(String base64Image) {
        String base64Data = base64Image.contains(",")
                ? base64Image.split(",")[1]
                : base64Image;
        return Base64.getDecoder().decode(base64Data);
    }
}
