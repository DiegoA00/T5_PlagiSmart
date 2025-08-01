package com.anecacao.api.reporting.domain.service.impl;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.reporting.data.dto.CleanupReportDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.data.dto.IndustrialSafetyConditionsDTO;
import com.anecacao.api.reporting.data.dto.SimpleUserDTO;
import com.anecacao.api.reporting.data.entity.CleanupReport;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import com.anecacao.api.reporting.data.entity.IndustrialSafetyConditions;
import com.anecacao.api.reporting.data.entity.Supply;
import com.anecacao.api.reporting.data.repository.CleanupReportRepository;
import com.anecacao.api.reporting.data.repository.FumigationReportRepository;
import com.anecacao.api.reporting.data.entity.IndustrialSafetyConditions;
import com.anecacao.api.reporting.domain.exception.InvalidFumigationStatusException;
import com.anecacao.api.reporting.domain.service.exception.TechnicalRoleException;
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReportServiceImplTest {
    @Mock
    private FumigationRepository fumigationRepository;
    @Mock
    private FumigationApplicationMapper mapper;
    @Mock
    private FumigationReportRepository fumigationReportRepository;
    @Mock
    private CleanupReportRepository cleanupReportRepository;
    @Mock
    private UserService userService;
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
        IndustrialSafetyConditionsDTO safety = new IndustrialSafetyConditionsDTO();
        dto.setIndustrialSafetyConditions(safety);

        fumigation.setId(3L);
        fumigation.setStatus(Status.APPROVED);

        when(fumigationRepository.findById(3L)).thenReturn(Optional.of(fumigation));
        when(fumigationReportRepository.findByFumigationId(3L)).thenReturn(Optional.empty());

        FumigationReport report = new FumigationReport();
        report.setSupplies(List.of(new Supply()));
        when(mapper.toFumigationReport(dto)).thenReturn(report);

        SimpleUserDTO simpleUserDTO = new SimpleUserDTO();
        simpleUserDTO.setId(1L);
        when(userService.hasRole("1", RoleName.ROLE_TECHNICIAN)).thenReturn(true);
        dto.setTechnicians(List.of(simpleUserDTO));

        IndustrialSafetyConditions mockedConditions = mock(IndustrialSafetyConditions.class);
        when(mockedConditions.hasAnyDanger()).thenReturn(true);
        //when(mapper.toConditionEntity(safety)).thenReturn(mockedConditions);

        MessageDTO result = service.createFumigationReport(dto);

        assertNull(result);
        assertEquals(Status.FAILED, fumigation.getStatus());
        verify(fumigationRepository).save(fumigation);
        verify(fumigationReportRepository).save(report);
    }

    @Test
    @DisplayName("Should create report and return success message when all is valid")
    void shouldCreateReportAndReturnSuccessMessageWhenAllIsValid() {
        dto.setId(4L);
        IndustrialSafetyConditionsDTO safety = new IndustrialSafetyConditionsDTO();
        dto.setIndustrialSafetyConditions(safety);
        when(safety.hasAnyDanger()).thenReturn(false);

        fumigation.setId(4L);
        fumigation.setStatus(Status.APPROVED);

        when(fumigationRepository.findById(4L)).thenReturn(Optional.of(fumigation));
        when(fumigationReportRepository.findByFumigationId(4L)).thenReturn(Optional.empty());

        FumigationReport report = new FumigationReport();
        report.setSupplies(List.of(new Supply()));
        when(mapper.toFumigationReport(dto)).thenReturn(report);

        SimpleUserDTO simpleUserDTO = new SimpleUserDTO();
        simpleUserDTO.setId(1L);
        when(userService.hasRole("1", RoleName.ROLE_TECHNICIAN)).thenReturn(true);
        dto.setTechnicians(List.of(simpleUserDTO));

        MessageDTO result = service.createFumigationReport(dto);

        assertNotNull(result);
        assertEquals("Fumigation report created successfully", result.getMessage());
        assertEquals(Status.APPROVED, fumigation.getStatus());
        verify(fumigationRepository).save(fumigation);
        verify(fumigationReportRepository).save(report);
    }

    @Test
    @DisplayName("Should throw FumigationNotFoundException for CleanupReport when fumigation does not exist")
    void shouldThrowFumigationNotFoundExceptionForCleanupReport() {
        CleanupReportDTO dto = new CleanupReportDTO();
        dto.setId(10L);

        when(fumigationRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(FumigationNotFoundException.class, () -> service.createCleanupReport(dto));
    }

    @Test
    @DisplayName("Should throw InvalidFumigationStatusException for CleanupReport when status invalid")
    void shouldThrowInvalidFumigationStatusExceptionForCleanupReport() {
        CleanupReportDTO dto = new CleanupReportDTO();
        dto.setId(11L);

        fumigation.setId(11L);
        fumigation.setStatus(Status.PENDING);

        when(fumigationRepository.findById(11L)).thenReturn(Optional.of(fumigation));

        assertThrows(InvalidFumigationStatusException.class, () -> service.createCleanupReport(dto));
    }


    @Test
    @DisplayName("Should return null and set status FAILED for CleanupReport when there is danger")
    void shouldReturnNullAndSetFailedForCleanupReportWhenDanger() {
        CleanupReportDTO dto = new CleanupReportDTO();
        dto.setId(12L);

        IndustrialSafetyConditions danger = new IndustrialSafetyConditions();
        danger.setHitDanger(true);
        dto.setIndustrialSafetyConditions(danger);

        SimpleUserDTO simpleUserDTO = new SimpleUserDTO();
        simpleUserDTO.setId(1L);
        dto.setTechnicians(List.of(simpleUserDTO));

        when(userService.hasRole("1", RoleName.ROLE_TECHNICIAN)).thenReturn(true);

        fumigation.setId(12L);
        fumigation.setStatus(Status.APPROVED);

        when(fumigationRepository.findById(12L)).thenReturn(Optional.of(fumigation));
        when(cleanupReportRepository.findByFumigationId(12L)).thenReturn(Optional.empty());

        CleanupReport report = new CleanupReport();
        when(mapper.toCleanupReport(dto)).thenReturn(report);

        MessageDTO result = service.createCleanupReport(dto);

        assertNull(result);
        assertEquals(Status.FAILED, fumigation.getStatus());
        verify(cleanupReportRepository).save(report);
    }

    @Test
    @DisplayName("Should throw TechnicalRoleException when a technician does not have the required role")
    void shouldThrowExceptionWhenTechnicianIsInvalid() {
        SimpleUserDTO userDTO = new SimpleUserDTO();
        userDTO.setId(99L);

        FumigationReportDTO dto = new FumigationReportDTO();
        dto.setId(1L);
        dto.setTechnicians(List.of(userDTO));

        fumigation.setId(1L);
        fumigation.setStatus(Status.APPROVED);

        when(fumigationRepository.findById(1L)).thenReturn(Optional.of(fumigation));
        when(userService.hasRole("99", RoleName.ROLE_TECHNICIAN)).thenReturn(false);

        assertThrows(TechnicalRoleException.class, () -> service.createFumigationReport(dto));
    }
}
