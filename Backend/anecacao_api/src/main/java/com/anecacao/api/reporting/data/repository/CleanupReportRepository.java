package com.anecacao.api.reporting.data.repository;

import com.anecacao.api.reporting.data.entity.CleanupReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CleanupReportRepository extends JpaRepository<CleanupReport, Long> {
    Optional<CleanupReport> findByFumigationId(Long fumigationId);
}
