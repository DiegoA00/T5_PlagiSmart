package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FumigationRepository extends JpaRepository<Fumigation, Long> {
    Page<Fumigation> findByStatus(Status status, Pageable pageable);
    @Query("SELECT f FROM Fumigation f " +
            "WHERE f.status = :status " +
            "AND f.fumigationApplication.company.legalRepresentative.id = :userId")
    Page<Fumigation> findByStatusAndUserId(@Param("status") Status status,
                                           @Param("userId") Long userId,
                                           Pageable pageable);
}
