package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.request.creation.data.dto.response.FumigationDetailDTO;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.auth.data.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface FumigationDetailMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "lotNumber", source = "lotNumber")
    @Mapping(target = "companyName", expression = "java(getCompanyName(fumigation))")
    @Mapping(target = "representative", expression = "java(getRepresentativeName(fumigation))")
    @Mapping(target = "phoneNumber", expression = "java(getPhoneNumber(fumigation))")
    @Mapping(target = "location", expression = "java(getLocation(fumigation))")
    @Mapping(target = "plannedDate", expression = "java(formatPlannedDate(fumigation))")
    FumigationDetailDTO toDetailDto(Fumigation fumigation);

    List<FumigationDetailDTO> toDetailDtoList(List<Fumigation> fumigations);

    default String formatPlannedDate(Fumigation fumigation) {
        if (fumigation.getDateTime() != null) {
            return fumigation.getDateTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm"));
        }
        return "No date";
    }

    default String getCompanyName(Fumigation fumigation) {
        if (fumigation.getFumigationApplication() != null &&
                fumigation.getFumigationApplication().getCompany() != null) {
            return fumigation.getFumigationApplication().getCompany().getName();
        }
        return "Unknown";
    }

    default String getRepresentativeName(Fumigation fumigation) {
        if (fumigation.getFumigationApplication() != null &&
                fumigation.getFumigationApplication().getCompany() != null &&
                fumigation.getFumigationApplication().getCompany().getLegalRepresentative() != null) {
            User rep = fumigation.getFumigationApplication().getCompany().getLegalRepresentative();
            return (rep.getFirstName() != null ? rep.getFirstName() : "") + " " +
                    (rep.getLastName() != null ? rep.getLastName() : "");
        }
        return "Unknown";
    }

    default String getPhoneNumber(Fumigation fumigation) {
        if (fumigation.getFumigationApplication() != null &&
                fumigation.getFumigationApplication().getCompany() != null) {
            String phone = fumigation.getFumigationApplication().getCompany().getPhoneNumber();
            return phone != null ? phone : "No phone";
        }
        return "No phone";
    }

    default String getLocation(Fumigation fumigation) {
        if (fumigation.getFumigationApplication() != null &&
                fumigation.getFumigationApplication().getCompany() != null) {
            String address = fumigation.getFumigationApplication().getCompany().getAddress();
            return address != null ? address : "No location";
        }
        return "No location";
    }
}