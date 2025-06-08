package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.repository.CompanyRepository;
import com.anecacao.api.request.creation.domain.exception.CompanyNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@DisplayName("Tests for getCompanyOwnedByLegalRepresentative: returns company if user is legal representative, throws if not found")
public class CompanyServiceImplTest {
    private CompanyRepository repository;
    private CompanyServiceImpl subject;

    private Company company;
    private User user;

    @BeforeEach
    void setUp() {
        repository = mock(CompanyRepository.class);
        subject = new CompanyServiceImpl(repository);

        user = new User();
        user.setId(1L);
        user.setFirstName("Test User");

        company = new Company();
        company.setId(100L);
        company.setLegalRepresentative(user);
    }

    @Test
    @DisplayName("Should return the company when user is its legal representative")
    void testGetCompanyOwnedByLegalRepresentative_success() {
        when(repository.findByIdAndLegalRepresentative(100L, user))
                .thenReturn(Optional.of(company));

        Company result = subject.getCompanyOwnedByLegalRepresentative(100L, user);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals(user, result.getLegalRepresentative());
    }

    @Test
    @DisplayName("Should throw CompanyNotFoundException when company is not found or user is not the legal representative")
    void testGetCompanyOwnedByLegalRepresentative_notFound() {
        when(repository.findByIdAndLegalRepresentative(200L, user))
                .thenReturn(Optional.empty());

        CompanyNotFoundException exception = assertThrows(
                CompanyNotFoundException.class,
                () -> subject.getCompanyOwnedByLegalRepresentative(200L, user)
        );

        assertTrue(exception.getMessage().contains("200"));
        assertTrue(exception.getMessage().contains("1"));
    }
}