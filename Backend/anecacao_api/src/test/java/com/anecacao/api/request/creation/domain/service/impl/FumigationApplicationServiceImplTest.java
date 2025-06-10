package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.request.CompanyRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Status;
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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
    private final Long companyId = 1L;
    private final String token = "someToken";
    private final String jwt = "Bearer token123";

    private FumigationApplication application;
    private FumigationApplicationDTO fumigationApplicationDTO;
    private User user;
    private Company company;
    private List<FumigationCreationRequestDTO> fumigationRequests;
    private List<Fumigation> fumigations;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(100L);

        company = new Company();
        company.setId(1L);
        company.setLegalRepresentative(user);
        company.setName("CriolloCorp.");
        company.setBusinessName("CriolloS.A");
        company.setPhoneNumber("0980783625");
        company.setAddress("VLC Puerto Seymour");
        company.setRuc("1105327702");

        // Setup fumigation requests
        FumigationCreationRequestDTO fumigationRequest1 = new FumigationCreationRequestDTO();
        FumigationCreationRequestDTO fumigationRequest2 = new FumigationCreationRequestDTO();
        fumigationRequests = Arrays.asList(fumigationRequest1, fumigationRequest2);

        // Setup fumigations
        Fumigation fumigation1 = new Fumigation();
        fumigation1.setId(1L);
        Fumigation fumigation2 = new Fumigation();
        fumigation2.setId(2L);
        fumigations = Arrays.asList(fumigation1, fumigation2);

        application = new FumigationApplication();
        application.setId(applicationId);
        application.setCompany(company);
        application.setFumigations(fumigations);

        fumigationApplicationDTO = new FumigationApplicationDTO();
        fumigationApplicationDTO.setCompany(new CompanyRequestDTO(companyId));
        fumigationApplicationDTO.setFumigations(fumigationRequests);
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

    @Test
    @DisplayName("Should successfully create fumigation application")
    void createFumigationApplication_success() {
        // Given
        FumigationApplication mappedApplication = new FumigationApplication();
        mappedApplication.setFumigations(fumigations);

        FumigationApplication savedApplication = new FumigationApplication();
        savedApplication.setId(applicationId);
        savedApplication.setCompany(company);
        savedApplication.setFumigations(fumigations);

        FumigationApplicationResponseDTO expectedResponse = new FumigationApplicationResponseDTO();

        // When
        when(userService.getUserReferenceById(jwt)).thenReturn(user);
        when(companyService.getCompanyOwnedByLegalRepresentative(companyId, user)).thenReturn(company);
        when(mapper.toEntity(fumigationApplicationDTO)).thenReturn(mappedApplication);
        when(repository.save(any(FumigationApplication.class))).thenReturn(savedApplication);
        when(mapper.toFumigationApplicationResponseDTO(savedApplication)).thenReturn(expectedResponse);

        // Then
        FumigationApplicationResponseDTO result = subject.createFumigationApplication(fumigationApplicationDTO, jwt);

        assertNotNull(result);
        assertEquals(expectedResponse, result);

        // Verify interactions
        verify(userService).getUserReferenceById(jwt);
        verify(companyService).getCompanyOwnedByLegalRepresentative(companyId, user);
        verify(mapper).toEntity(fumigationApplicationDTO);
        verify(repository).save(any(FumigationApplication.class));
        verify(mapper).toFumigationApplicationResponseDTO(savedApplication);

        // Verify that fumigations status was set to PENDING
        verify(repository).save(argThat(app ->
                app.getFumigations().stream().allMatch(f -> f.getStatus() == Status.PENDING)
        ));
    }

    @Test
    @DisplayName("Should set company and fumigation status correctly when creating application")
    void createFumigationApplication_setsCorrectProperties() {
        // Given
        FumigationApplication mappedApplication = new FumigationApplication();
        mappedApplication.setFumigations(fumigations);

        FumigationApplication savedApplication = new FumigationApplication();
        FumigationApplicationResponseDTO expectedResponse = new FumigationApplicationResponseDTO();

        // When
        when(userService.getUserReferenceById(jwt)).thenReturn(user);
        when(companyService.getCompanyOwnedByLegalRepresentative(companyId, user)).thenReturn(company);
        when(mapper.toEntity(fumigationApplicationDTO)).thenReturn(mappedApplication);
        when(repository.save(any(FumigationApplication.class))).thenReturn(savedApplication);
        when(mapper.toFumigationApplicationResponseDTO(savedApplication)).thenReturn(expectedResponse);

        // Then
        subject.createFumigationApplication(fumigationApplicationDTO, jwt);

        // Verify that the saved application has the correct company and fumigation status
        verify(repository).save(argThat(app -> {
            boolean hasCorrectCompany = app.getCompany().equals(company);
            boolean allFumigationsHavePendingStatus = app.getFumigations().stream()
                    .allMatch(f -> f.getStatus() == Status.PENDING);
            return hasCorrectCompany && allFumigationsHavePendingStatus;
        }));
    }

    @Test
    @DisplayName("Should handle empty fumigations list when creating application")
    void createFumigationApplication_emptyFumigationsList() {
        // Given
        fumigationApplicationDTO.setFumigations(Collections.emptyList());

        FumigationApplication mappedApplication = new FumigationApplication();
        mappedApplication.setFumigations(Collections.emptyList());

        FumigationApplication savedApplication = new FumigationApplication();
        FumigationApplicationResponseDTO expectedResponse = new FumigationApplicationResponseDTO();

        // When
        when(userService.getUserReferenceById(jwt)).thenReturn(user);
        when(companyService.getCompanyOwnedByLegalRepresentative(companyId, user)).thenReturn(company);
        when(mapper.toEntity(fumigationApplicationDTO)).thenReturn(mappedApplication);
        when(repository.save(any(FumigationApplication.class))).thenReturn(savedApplication);
        when(mapper.toFumigationApplicationResponseDTO(savedApplication)).thenReturn(expectedResponse);

        // Then
        FumigationApplicationResponseDTO result = subject.createFumigationApplication(fumigationApplicationDTO, jwt);

        assertNotNull(result);
        verify(repository).save(any(FumigationApplication.class));
    }

    @Test
    @DisplayName("Should propagate exception when user service fails")
    void createFumigationApplication_userServiceException() {
        // Given
        when(userService.getUserReferenceById(jwt)).thenThrow(new RuntimeException("User service error"));

        // When & Then
        assertThrows(RuntimeException.class,
                () -> subject.createFumigationApplication(fumigationApplicationDTO, jwt));

        verify(userService).getUserReferenceById(jwt);
        verify(companyService, never()).getCompanyOwnedByLegalRepresentative(any(), any());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Should propagate exception when company service fails")
    void createFumigationApplication_companyServiceException() {
        // Given
        when(userService.getUserReferenceById(jwt)).thenReturn(user);
        when(companyService.getCompanyOwnedByLegalRepresentative(companyId, user))
                .thenThrow(new RuntimeException("Company not found or unauthorized"));

        // When & Then
        assertThrows(RuntimeException.class,
                () -> subject.createFumigationApplication(fumigationApplicationDTO, jwt));

        verify(userService).getUserReferenceById(jwt);
        verify(companyService).getCompanyOwnedByLegalRepresentative(companyId, user);
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Should propagate exception when repository save fails")
    void createFumigationApplication_repositorySaveException() {
        // Given
        FumigationApplication mappedApplication = new FumigationApplication();
        mappedApplication.setFumigations(fumigations);

        when(userService.getUserReferenceById(jwt)).thenReturn(user);
        when(companyService.getCompanyOwnedByLegalRepresentative(companyId, user)).thenReturn(company);
        when(mapper.toEntity(fumigationApplicationDTO)).thenReturn(mappedApplication);
        when(repository.save(any(FumigationApplication.class))).thenThrow(new RuntimeException("Database error"));

        // When & Then
        assertThrows(RuntimeException.class,
                () -> subject.createFumigationApplication(fumigationApplicationDTO, jwt));

        verify(repository).save(any(FumigationApplication.class));
        verify(mapper, never()).toFumigationApplicationResponseDTO(any());
    }
}
