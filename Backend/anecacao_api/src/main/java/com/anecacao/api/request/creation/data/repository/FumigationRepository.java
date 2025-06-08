package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.Fumigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FumigationRepository extends JpaRepository <Fumigation, Long> {
}
