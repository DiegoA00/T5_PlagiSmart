package com.anecacao.api.reporting.data.repository;

import com.anecacao.api.reporting.data.entity.FumigationReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FumigationReportRepository extends JpaRepository<FumigationReport, Long> {
    Optional<FumigationReport> findByFumigationId(Long fumigationId);
}
