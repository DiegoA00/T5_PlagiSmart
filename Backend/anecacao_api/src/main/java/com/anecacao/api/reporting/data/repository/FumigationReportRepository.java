package com.anecacao.api.reporting.data.repository;

import com.anecacao.api.reporting.data.entity.FumigationReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface FumigationReportRepository extends JpaRepository<FumigationReport, Long> {
    Optional<FumigationReport> findByFumigationId(Long fumigationId);

    Page<FumigationReport> findByDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<FumigationReport> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    @Query("SELECT fr FROM FumigationReport fr JOIN fr.technicians t WHERE t.id = :technicianId")
    Page<FumigationReport> findByTechnicianId(@Param("technicianId") Long technicianId, Pageable pageable);

    @Query("SELECT fr FROM FumigationReport fr WHERE fr.fumigation.status = :status")
    Page<FumigationReport> findByFumigationStatus(@Param("status") String status, Pageable pageable);

    @Query("SELECT fr FROM FumigationReport fr WHERE " +
            "(:location IS NULL OR LOWER(fr.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:startDate IS NULL OR fr.date >= :startDate) AND " +
            "(:endDate IS NULL OR fr.date <= :endDate)")
    Page<FumigationReport> findByFilters(@Param("location") String location,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate,
                                         Pageable pageable);
}
