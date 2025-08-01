package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FumigationRepository extends JpaRepository<Fumigation, Long> {
    List<Fumigation> findByStatus(Status status);
}
