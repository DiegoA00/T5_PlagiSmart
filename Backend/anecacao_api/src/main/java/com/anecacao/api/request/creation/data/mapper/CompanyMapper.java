package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.dto.request.CompanyRequestDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyMapper {
    Company toCompanyEntity(CompanyRequestDTO dto);
}
