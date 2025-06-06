package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FumigationApplicationRepository extends JpaRepository<FumigationApplication, Long> {
}