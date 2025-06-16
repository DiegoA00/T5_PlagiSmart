package com.anecacao.api.request.creation.data.repository;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByIdAndLegalRepresentative(Long companyId, User legalRepresentative);
}
