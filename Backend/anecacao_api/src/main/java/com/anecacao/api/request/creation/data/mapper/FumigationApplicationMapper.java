package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.reporting.data.dto.CleanupReportDTO;
import com.anecacao.api.reporting.data.dto.FumigationReportDTO;
import com.anecacao.api.reporting.data.dto.IndustrialSafetyConditionsDTO;
import com.anecacao.api.reporting.data.entity.CleanupReport;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import com.anecacao.api.reporting.data.entity.IndustrialSafetyConditions;
import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationSummaryDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {CompanyMapper.class})
public interface FumigationApplicationMapper {
    @Mapping(target = "company", source = "company")
    FumigationApplication toEntity(FumigationApplicationDTO dto);

    @Mapping(target = "fumigationApplication", ignore = true)
    Fumigation toFumigationEntity(FumigationCreationRequestDTO dto);

    FumigationApplicationResponseDTO toFumigationApplicationResponseDTO (FumigationApplication fumigationApplication);

    FumigationResponseDTO toFumigationResponseDTO(Fumigation fumigation);

    // Agregar el mapeo para FumigationSummaryDTO individual
    @Mapping(target = "time", expression = "java(formatTime(fumigation.getDateTime()))")
    FumigationSummaryDTO toSummaryDto(Fumigation fumigation);

    List<FumigationSummaryDTO> toSummaryDtoList(List<Fumigation> fumigations);

    // Método helper para formatear la hora
    default String formatTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    @AfterMapping
    default void linkFumigationApplication(@MappingTarget FumigationApplication entity) {
        if (entity.getFumigations() != null) {
            List<Fumigation> fumigationCopy = new ArrayList<>(entity.getFumigations());
            for (Fumigation f : fumigationCopy) {
                f.setFumigationApplication(entity);
            }
        }
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "environmentalConditions", source = "environmentalConditions")
    @Mapping(target = "supervisor", source = "supervisor")
    FumigationReport toFumigationReport (FumigationReportDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "environmentalConditions", source = "environmentalConditions")
    @Mapping(target = "supervisor", source = "supervisor")
    void updateFumigationReportFromDTO(FumigationReportDTO dto, @MappingTarget FumigationReport report);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "stripsState", source = "lotDescription.stripsState")
    @Mapping(target = "fumigationTime", source = "lotDescription.fumigationTime")
    @Mapping(target = "ppmFosfina", source = "lotDescription.ppmFosfina")
    CleanupReport toCleanupReport(CleanupReportDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "stripsState", source = "lotDescription.stripsState")
    @Mapping(target = "fumigationTime", source = "lotDescription.fumigationTime")
    @Mapping(target = "ppmFosfina", source = "lotDescription.ppmFosfina")
    void updateCleanupReportFromDTO(CleanupReportDTO dto, @MappingTarget CleanupReport entity);

    IndustrialSafetyConditions toConditionEntity(IndustrialSafetyConditionsDTO dto);
}
