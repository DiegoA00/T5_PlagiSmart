package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.repository.FumigationApplicationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationApplicationNotFoundException;
import com.anecacao.api.request.creation.domain.service.CompanyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FumigationApplicationServiceImplTest {
    @Mock
    private FumigationApplicationRepository repository;

    @Mock
    private UserService userService;

    @Mock
    private CompanyService companyService;

    @Mock
    private FumigationApplicationMapper mapper;

    @InjectMocks
    private FumigationApplicationServiceImpl subject;

    private final Long applicationId = 1L;
    private final String token = "someToken";
    private FumigationApplication application;
    private User user;
    private Company company;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(100L);

        company = new Company();
        company.setId(1L);
        company.setLegalRepresentative(user);

        application = new FumigationApplication();
        application.setId(applicationId);
        application.setCompany(company);
        application.setFumigations(Collections.emptyList());
    }

    @Test
    @DisplayName("Should return fumigation application when user is owner")
    void getFumigationApplicationById_success_asOwner() {
        when(repository.findById(applicationId)).thenReturn(Optional.of(application));
        when(userService.getUserReferenceById(token)).thenReturn(user);

        FumigationApplicationResponseDTO expectedDto = new FumigationApplicationResponseDTO();
        when(mapper.toFumigationApplicationResponseDTO(application)).thenReturn(expectedDto);

        FumigationApplicationResponseDTO result = subject.getFumigationApplicationById(applicationId, token);

        assertNotNull(result);
        assertEquals(expectedDto, result);
    }

    @Test
    @DisplayName("Should return fumigation application when user is admin")
    void getFumigationApplicationById_success_asAdmin() {
        when(repository.findById(applicationId)).thenReturn(Optional.of(application));
        when(userService.getUserReferenceById(token)).thenReturn(user);

        FumigationApplicationResponseDTO expectedDto = new FumigationApplicationResponseDTO();
        when(mapper.toFumigationApplicationResponseDTO(application)).thenReturn(expectedDto);

        FumigationApplicationResponseDTO result = subject.getFumigationApplicationById(applicationId, token);

        assertNotNull(result);
        assertEquals(expectedDto, result);
    }

    @Test
    @DisplayName("Should throw exception when application not found")
    void getFumigationApplicationById_failure_notFound() {
        when(repository.findById(applicationId)).thenReturn(Optional.empty());

        assertThrows(FumigationApplicationNotFoundException.class,
                () -> subject.getFumigationApplicationById(applicationId, token));
    }

    @Test
    @DisplayName("Should throw exception when user not authorized")
    void getFumigationApplicationById_failure_unauthorized() {
        User otherUser = new User();
        otherUser.setId(999L);
        application.getCompany().setLegalRepresentative(otherUser);

        when(repository.findById(applicationId)).thenReturn(Optional.of(application));
        when(userService.getUserReferenceById(token)).thenReturn(user); // user != legalRepresentative
        when(userService.hasRole(user.getId().toString(), RoleName.ROLE_ADMIN)).thenReturn(false);

        assertThrows(UnauthorizedAccessException.class,
                () -> subject.getFumigationApplicationById(applicationId, token));
    }
}
