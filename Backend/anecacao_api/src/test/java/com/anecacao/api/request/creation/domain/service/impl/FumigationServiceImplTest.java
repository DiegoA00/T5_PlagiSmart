package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.request.UpdateStatusRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationDetailDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationSummaryDTO;
import com.anecacao.api.request.creation.data.entity.*;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.mapper.FumigationMapper;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import com.anecacao.api.request.creation.domain.exception.FumigationValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FumigationServiceImplTest {
    @Mock
    private FumigationRepository repository;

    @Mock
    private UserService userService;

    @Mock
    private FumigationApplicationMapper mapper;

    @Mock
    private FumigationMapper fumigationMapper;


    @InjectMocks
    private FumigationServiceImpl subject;

    private final Long fumigationId = 1L;
    private final String token = "testToken";

    private User user;
    private Company company;
    private FumigationApplication application;
    private Fumigation fumigation;

    @BeforeEach
    void setUpEntities() {
        user = new User();
        user.setId(100L);

        company = new Company();
        company.setId(10L);
        company.setLegalRepresentative(user);

        application = new FumigationApplication();
        application.setId(20L);
        application.setCompany(company);

        fumigation = new Fumigation();
        fumigation.setId(fumigationId);
        fumigation.setFumigationApplication(application);
    }

    @Test
    @DisplayName("Should update fumigation when user is company owner")
    void updateFumigation_success_owner() {
        FumigationCreationRequestDTO dto = buildSampleDTO();

        when(repository.findById(fumigationId)).thenReturn(Optional.of(fumigation));
        when(userService.getUserReferenceById(token)).thenReturn(user);
        when(repository.save(fumigation)).thenReturn(fumigation);

        FumigationResponseDTO response = new FumigationResponseDTO();
        when(mapper.toFumigationResponseDTO(fumigation)).thenReturn(response);

        FumigationResponseDTO result = subject.updateFumigation(fumigationId, dto, token);

        assertNotNull(result);
        assertSame(response, result);
        verify(repository).save(fumigation);

        assertEquals(dto.getTon(), fumigation.getTon());
        assertEquals(dto.getQuality(), fumigation.getQuality());
        assertEquals(dto.getPortDestination(), fumigation.getPortDestination());
    }

    @Test
    @DisplayName("Should update fumigation when user has ADMIN role")
    void updateFumigation_success_admin() {
        FumigationCreationRequestDTO dto = buildSampleDTO();

        when(repository.findById(fumigationId)).thenReturn(Optional.of(fumigation));
        when(userService.getUserReferenceById(token)).thenReturn(user);
        when(repository.save(fumigation)).thenReturn(fumigation);

        FumigationResponseDTO response = new FumigationResponseDTO();
        when(mapper.toFumigationResponseDTO(fumigation)).thenReturn(response);

        FumigationResponseDTO result = subject.updateFumigation(fumigationId, dto, token);

        assertNotNull(result);
        assertSame(response, result);
    }

    @Test
    @DisplayName("Should throw FumigationNotFoundException when fumigation does not exist")
    void updateFumigation_notFound() {
        when(repository.findById(fumigationId)).thenReturn(Optional.empty());

        assertThrows(FumigationNotFoundException.class,
                () -> subject.updateFumigation(fumigationId, buildSampleDTO(), token));
    }

    @Test
    @DisplayName("Should throw UnauthorizedAccessException when user is not authorized")
    void updateFumigation_unauthorized() {
        User other = new User();
        other.setId(999L);
        fumigation.getFumigationApplication().getCompany().setLegalRepresentative(other);

        when(repository.findById(fumigationId)).thenReturn(Optional.of(fumigation));
        when(userService.getUserReferenceById(token)).thenReturn(user);
        when(userService.hasRole("100", RoleName.ROLE_ADMIN)).thenReturn(false);

        UnauthorizedAccessException ex = assertThrows(UnauthorizedAccessException.class,
                () -> subject.updateFumigation(fumigationId, buildSampleDTO(), token));

        assertTrue(ex.getMessage().contains("Fumigation"));
        assertTrue(ex.getMessage().contains(fumigationId.toString()));
    }

    private FumigationCreationRequestDTO buildSampleDTO() {
        FumigationCreationRequestDTO dto = new FumigationCreationRequestDTO();
        dto.setTon(new BigDecimal("15.5"));
        dto.setSacks(100L);
        dto.setQuality(Grade.GRADE_3.toString());
        dto.setDateTime(LocalDateTime.of(2024, 6, 1, 10, 0));
        return dto;
    }

    @Test
    @DisplayName("Should update fumigation status successfully")
    void updateFumigationStatus_success() {
        UpdateStatusRequestDTO dto = new UpdateStatusRequestDTO();
        dto.setStatus(Status.REJECTED);
        dto.setMessage("The fumigation was rejected due to X reason");

        when(repository.findById(fumigationId)).thenReturn(Optional.of(fumigation));

        // Call the method to test
        subject.updateFumigationStatus(fumigationId, dto);

        // Verify that the status and message are correctly updated
        assertEquals(Status.REJECTED, fumigation.getStatus());
        assertEquals("The fumigation was rejected due to X reason", fumigation.getMessage());
        verify(repository, times(1)).save(fumigation); // Ensure save was called
    }

    @Test
    @DisplayName("Should throw FumigationNotFoundException when fumigation not found")
    void updateFumigationStatus_fumigationNotFound() {
        UpdateStatusRequestDTO dto = new UpdateStatusRequestDTO();
        dto.setStatus(Status.REJECTED);
        dto.setMessage("Some rejection reason");

        when(repository.findById(fumigationId)).thenReturn(Optional.empty());

        // Assert that FumigationNotFoundException is thrown
        assertThrows(FumigationNotFoundException.class,
                () -> subject.updateFumigationStatus(fumigationId, dto));
    }

    @Test
    @DisplayName("Should throw FumigationValidationException when status is REJECTED but no message is provided")
    void updateFumigationStatus_validationException() {
        UpdateStatusRequestDTO dto = new UpdateStatusRequestDTO();
        dto.setStatus(Status.REJECTED); // Status is REJECTED, but no message

        // Simulate that the fumigation exists
        when(repository.findById(fumigationId)).thenReturn(Optional.of(fumigation));

        // Assert that FumigationValidationException is thrown
        assertThrows(FumigationValidationException.class,
                () -> subject.updateFumigationStatus(fumigationId, dto));
    }

    @Test
    @DisplayName("Should return fumigation response successfully when user is authorized")
    void getFumigationById_success() {
        FumigationResponseDTO expectedDto = new FumigationResponseDTO();

        when(repository.findById(fumigationId)).thenReturn(Optional.of(fumigation));
        when(userService.getUserReferenceById(token)).thenReturn(user);
        when(mapper.toFumigationResponseDTO(fumigation)).thenReturn(expectedDto);

        // Call the method to test
        FumigationResponseDTO result = subject.getFumigationById(fumigationId, token);

        // Verify the results
        assertNotNull(result);
        assertSame(expectedDto, result);
        verify(repository, times(1)).findById(fumigationId); // Ensure findById was called
    }

    @Test
    @DisplayName("Should throw FumigationNotFoundException when fumigation not found")
    void getFumigationById_notFound() {
        when(repository.findById(fumigationId)).thenReturn(Optional.empty());

        // Assert that FumigationNotFoundException is thrown
        assertThrows(FumigationNotFoundException.class,
                () -> subject.getFumigationById(fumigationId, token));
    }

    @Test
    @DisplayName("Should throw UnauthorizedAccessException when user is not authorized")
    void getFumigationById_unauthorized() {
        // Simulate another user as the legal representative
        User otherUser = new User();
        otherUser.setId(999L);
        fumigation.getFumigationApplication().getCompany().setLegalRepresentative(otherUser);

        when(repository.findById(fumigationId)).thenReturn(Optional.of(fumigation));
        when(userService.getUserReferenceById(token)).thenReturn(user); // The token belongs to a different user

        // Assert that UnauthorizedAccessException is thrown
        UnauthorizedAccessException ex = assertThrows(UnauthorizedAccessException.class,
                () -> subject.getFumigationById(fumigationId, token));

        assertTrue(ex.getMessage().contains("Fumigation"));
        assertTrue(ex.getMessage().contains(fumigationId.toString()));
    }
}