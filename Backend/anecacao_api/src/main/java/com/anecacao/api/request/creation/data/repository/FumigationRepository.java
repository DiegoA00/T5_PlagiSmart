package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FumigationRepository extends JpaRepository<Fumigation, Long> {
    Page<Fumigation> findByStatus(Status status, Pageable pageable);
}
