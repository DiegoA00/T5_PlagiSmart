package com.anecacao.api.signature.data.repository;

import com.anecacao.api.signature.data.entity.Signature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SignatureRepository extends JpaRepository<Signature, Long> {
}
