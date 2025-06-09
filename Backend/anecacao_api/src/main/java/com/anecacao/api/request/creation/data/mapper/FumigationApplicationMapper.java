package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.request.creation.data.dto.request.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationApplicationResponseDTO;
import com.anecacao.api.request.creation.data.dto.request.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {CompanyMapper.class})
public interface FumigationApplicationMapper {
    @Mapping(target = "company", source = "company")
    @Mapping(target = "fumigations", ignore = false)
    FumigationApplication toEntity(FumigationApplicationDTO dto);

    @Mapping(target = "fumigationApplication", ignore = true)
    Fumigation toFumigationEntity(FumigationCreationRequestDTO dto);

    FumigationApplicationResponseDTO toFumigationApplicationResponseDTO (FumigationApplication fumigationApplication);

    FumigationResponseDTO toFumigationResponseDTO(Fumigation fumigation);
  
    @AfterMapping
    default void linkFumigationApplication(@MappingTarget FumigationApplication entity) {
        if (entity.getFumigations() != null) {
            List<Fumigation> fumigationCopy = new ArrayList<>(entity.getFumigations());
            for (Fumigation f : fumigationCopy) {
                f.setFumigationApplication(entity);
            }
        }
    }
}
