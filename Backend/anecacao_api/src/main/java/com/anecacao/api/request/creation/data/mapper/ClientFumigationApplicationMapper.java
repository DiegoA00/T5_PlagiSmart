package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.dto.response.ClientFumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {CompanyMapper.class})
public interface ClientFumigationApplicationMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "company", source = "company")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "totalTons", expression = "java(getTotalTons(entity))")
    @Mapping(target = "earlyDate", expression = "java(getEarlyDate(entity))")
    @Mapping(target = "fumigations", source = "fumigations")
    ClientFumigationApplicationDTO toDto(FumigationApplication entity);

    @Mapping(target = "dateTime", source = "dateTime")
    FumigationResponseDTO toFumigationResponseDTO(Fumigation fumigation);

    List<FumigationResponseDTO> toFumigationResponseDTOList(List<Fumigation> fumigations);

    /**
     * Calcula el total de toneladas de todas las fumigaciones
     * Utiliza la misma lógica que FumigationApplicationSummaryMapper
     */
    default BigDecimal getTotalTons(FumigationApplication app) {
        if (app.getFumigations() == null || app.getFumigations().isEmpty()) {
            return BigDecimal.ZERO;
        }

        return app.getFumigations().stream()
                .map(fumigation -> fumigation.getTon() != null ? fumigation.getTon() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Obtiene la fecha más temprana de todas las fumigaciones
     * Formato: "dd-MM-yyyy HH:mm"
     * Utiliza la misma lógica que FumigationApplicationSummaryMapper
     */
    default String getEarlyDate(FumigationApplication app) {
        if (app.getFumigations() == null || app.getFumigations().isEmpty()) {
            return "No date";
        }

        LocalDateTime earliestDate = app.getFumigations().stream()
                .map(Fumigation::getDateTime)
                .filter(dateTime -> dateTime != null)
                .min(Comparator.naturalOrder())
                .orElse(null);

        if (earliestDate != null) {
            return earliestDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"));
        }

        return "No date";
    }

    /**
     * Obtiene el nombre completo del representante legal
     * Similar a FumigationApplicationSummaryMapper
     */
    default String getRepresentativeName(FumigationApplication app) {
        if (app.getCompany() != null && app.getCompany().getLegalRepresentative() != null) {
            User rep = app.getCompany().getLegalRepresentative();
            String firstName = rep.getFirstName() != null ? rep.getFirstName() : "";
            String lastName = rep.getLastName() != null ? rep.getLastName() : "";
            return (firstName + " " + lastName).trim();
        }
        return "Unknown";
    }

    /**
     * Obtiene la dirección de la compañía
     */
    default String getCompanyAddress(FumigationApplication app) {
        return app.getCompany() != null && app.getCompany().getAddress() != null
                ? app.getCompany().getAddress()
                : "No location";
    }
}