package com.anecacao.api.reporting.data.repository;

import com.anecacao.api.reporting.data.entity.Supply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplyRepository extends JpaRepository <Supply, Long> {
}
