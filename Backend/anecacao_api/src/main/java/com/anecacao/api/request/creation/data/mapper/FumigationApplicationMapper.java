package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;
import com.anecacao.api.request.creation.data.dto.FumigationCreationRequestDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {CompanyMapper.class})
public interface FumigationApplicationMapper {
    @Mapping(target = "company", source = "company")
    @Mapping(target = "fumigations", source = "fumigation")
    FumigationApplication toEntity(FumigationApplicationDTO dto);

    @Mapping(target = "fumigationApplication", ignore = true)
    Fumigation toFumigationEntity(FumigationCreationRequestDTO dto);



    Set<Fumigation> toFumigationEntityList(Set<FumigationCreationRequestDTO> dtoList);
}
