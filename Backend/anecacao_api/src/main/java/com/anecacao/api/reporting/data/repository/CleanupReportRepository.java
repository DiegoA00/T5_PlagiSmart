package com.anecacao.api.reporting.data.repository;

import com.anecacao.api.reporting.data.entity.CleanupReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface CleanupReportRepository extends JpaRepository<CleanupReport, Long> {
    Optional<CleanupReport> findByFumigationId(Long fumigationId);

    // Búsqueda por rango de fechas
    Page<CleanupReport> findByDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    // Búsqueda por técnico
    @Query("SELECT cr FROM CleanupReport cr JOIN cr.technicians t WHERE t.id = :technicianId")
    Page<CleanupReport> findByTechnicianId(@Param("technicianId") Long technicianId, Pageable pageable);

    // Búsqueda por estado de la fumigación
    @Query("SELECT cr FROM CleanupReport cr WHERE cr.fumigation.status = :status")
    Page<CleanupReport> findByFumigationStatus(@Param("status") String status, Pageable pageable);

    // Búsqueda por rango de PPM de fosfina
    @Query("SELECT cr FROM CleanupReport cr WHERE cr.ppmFosfina BETWEEN :minPpm AND :maxPpm")
    Page<CleanupReport> findByPpmFosfinaBetween(@Param("minPpm") Double minPpm,
                                                @Param("maxPpm") Double maxPpm,
                                                Pageable pageable);

    // Búsqueda combinada
    @Query("SELECT cr FROM CleanupReport cr WHERE " +
            "(:startDate IS NULL OR cr.date >= :startDate) AND " +
            "(:endDate IS NULL OR cr.date <= :endDate) AND " +
            "(:minPpm IS NULL OR cr.ppmFosfina >= :minPpm) AND " +
            "(:maxPpm IS NULL OR cr.ppmFosfina <= :maxPpm)")
    Page<CleanupReport> findByFilters(@Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate,
                                      @Param("minPpm") Double minPpm,
                                      @Param("maxPpm") Double maxPpm,
                                      Pageable pageable);
}
