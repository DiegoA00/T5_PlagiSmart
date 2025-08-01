package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FumigationApplicationRepository extends JpaRepository<FumigationApplication, Long> {

    @Query("SELECT DISTINCT fa FROM FumigationApplication fa " +
            "JOIN fa.fumigations f " +
            "WHERE f.status = :status")
    List<FumigationApplication> findByFumigationStatus(@Param("status") Status status);
}