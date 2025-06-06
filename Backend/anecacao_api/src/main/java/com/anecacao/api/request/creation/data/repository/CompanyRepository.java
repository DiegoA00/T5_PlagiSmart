package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.request.creation.data.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {

}
