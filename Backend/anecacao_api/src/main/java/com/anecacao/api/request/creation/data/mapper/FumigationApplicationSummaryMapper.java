package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationSummaryDTO;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.auth.data.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Context;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring")
public interface FumigationApplicationSummaryMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "companyName", expression = "java(getCompanyName(application))")
    @Mapping(target = "representative", expression = "java(getRepresentativeName(application))")
    @Mapping(target = "location", expression = "java(getLocation(application))")
    @Mapping(target = "localDate", expression = "java(getLocalDate(application))")
    @Mapping(target = "status", expression = "java(status)")
    FumigationApplicationSummaryDTO toSummaryDto(FumigationApplication application, @Context String status);

    List<FumigationApplicationSummaryDTO> toSummaryDtoList(List<FumigationApplication> applications, @Context String status);

    default String getCompanyName(FumigationApplication app) {
        return app.getCompany() != null ? app.getCompany().getName() : "Unknown";
    }

    default String getRepresentativeName(FumigationApplication app) {
        if (app.getCompany() != null && app.getCompany().getLegalRepresentative() != null) {
            User rep = app.getCompany().getLegalRepresentative();
            String firstName = rep.getFirstName() != null ? rep.getFirstName() : "";
            String lastName = rep.getLastName() != null ? rep.getLastName() : "";
            return (firstName + " " + lastName).trim();
        }
        return "Unknown";
    }

    default String getLocation(FumigationApplication app) {
        return app.getCompany() != null && app.getCompany().getAddress() != null
                ? app.getCompany().getAddress()
                : "No location";
    }

    default String getLocalDate(FumigationApplication app) {
        return app.getFumigations().stream()
                .map(f -> {
                    if (f.getActualFumigationDate() != null) {
                        return f.getActualFumigationDate().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                    }
                    else if (f.getDateTime() != null) {
                        return f.getDateTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                    }
                    return null;
                })
                .filter(date -> date != null)
                .findFirst()
                .orElse("No date");
    }
}