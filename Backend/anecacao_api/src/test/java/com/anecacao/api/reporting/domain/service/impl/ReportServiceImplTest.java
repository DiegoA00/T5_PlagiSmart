package com.anecacao.api.reporting.domain.service.impl;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.data.dto.IndustrialSafetyConditionsDTO;
import com.anecacao.api.reporting.data.entity.IndustrialSafetyConditions;
import com.anecacao.api.reporting.domain.exception.InvalidFumigationStatusException;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.Status;
import com.anecacao.api.request.creation.data.mapper.FumigationApplicationMapper;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReportServiceImplTest {
    @Mock
    private FumigationRepository fumigationRepository;
    @Mock
    private FumigationApplicationMapper mapper;
    @InjectMocks
    private ReportsServiceImpl service;

    private FumigationReportDTO dto;
    private Fumigation fumigation;
    private IndustrialSafetyConditions safety;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dto = new FumigationReportDTO();
        fumigation = new Fumigation();
        safety = mock(IndustrialSafetyConditions.class);
    }

    @Test
    @DisplayName("Should throw FumigationNotFoundException when fumigation does not exist")
    void shouldThrowFumigationNotFoundExceptionWhenFumigationDoesNotExist() {
        dto.setId(1L);
        when(fumigationRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(FumigationNotFoundException.class, () -> service.createFumigationReport(dto));
    }

    @Test
    @DisplayName("Should throw InvalidFumigationStatusException when fumigation status is not APPROVED or FAILED")
    void shouldThrowInvalidFumigationStatusExceptionWhenStatusIsNotApprovedOrFailed() {
        dto.setId(2L);
        fumigation.setId(2L);
        fumigation.setStatus(Status.PENDING);
        when(fumigationRepository.findById(2L)).thenReturn(Optional.of(fumigation));
        assertThrows(InvalidFumigationStatusException.class, () -> service.createFumigationReport(dto));
    }

    @Test
    @DisplayName("Should set status to FAILED and return null when there is danger in industrial safety conditions")
    void shouldSetStatusToFailedAndReturnNullWhenDangerInIndustrialSafetyConditions() {
        dto.setId(3L);
        dto.setIndustrialSafetyConditions(safety);
        when(safety.hasAnyDanger()).thenReturn(true);
        fumigation.setId(3L);
        fumigation.setStatus(Status.APPROVED);
        fumigation.setSupplies(Collections.emptyList());
        when(fumigationRepository.findById(3L)).thenReturn(Optional.of(fumigation));
        doNothing().when(mapper).updateFumigationFromReport(dto, fumigation);
        when(fumigationRepository.save(fumigation)).thenReturn(fumigation);
        MessageDTO result = service.createFumigationReport(dto);
        assertNull(result);
        assertEquals(Status.FAILED, fumigation.getStatus());
        verify(fumigationRepository).save(fumigation);
    }

    @Test
    @DisplayName("Should create report and return success message when all is valid")
    void shouldCreateReportAndReturnSuccessMessageWhenAllIsValid() {
        dto.setId(4L);
        dto.setIndustrialSafetyConditions(safety);
        when(safety.hasAnyDanger()).thenReturn(false);
        fumigation.setId(4L);
        fumigation.setStatus(Status.APPROVED);
        fumigation.setSupplies(Collections.emptyList());
        when(fumigationRepository.findById(4L)).thenReturn(Optional.of(fumigation));
        doNothing().when(mapper).updateFumigationFromReport(dto, fumigation);
        when(fumigationRepository.save(fumigation)).thenReturn(fumigation);
        MessageDTO result = service.createFumigationReport(dto);
        assertNotNull(result);
        assertEquals("Fumigation report created successfully", result.getMessage());
        assertEquals(Status.APPROVED, fumigation.getStatus());
        verify(fumigationRepository).save(fumigation);
    }
}
