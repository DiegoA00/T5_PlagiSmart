package com.anecacao.api.signature.data.repository;

import com.anecacao.api.signature.data.entity.Signature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SignatureRepository extends JpaRepository<Signature, Long> {
    Optional<Signature> findByFumigationReportIdAndSignatureType(Long reportId, String signatureType);
    Optional<Signature> findByCleanupReportIdAndSignatureType(Long reportId, String signatureType);
}
