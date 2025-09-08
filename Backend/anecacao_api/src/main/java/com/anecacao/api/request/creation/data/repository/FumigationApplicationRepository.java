package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FumigationApplicationRepository extends JpaRepository<FumigationApplication, Long> {

    @Query("SELECT DISTINCT fa FROM FumigationApplication fa " +
            "JOIN fa.fumigations f " +
            "WHERE f.status = :status")
    Page<FumigationApplication> findByFumigationStatus(@Param("status") Status status, Pageable pageable);

    Page<FumigationApplication> findByCompanyLegalRepresentativeId(Long userId, Pageable pageable);
}