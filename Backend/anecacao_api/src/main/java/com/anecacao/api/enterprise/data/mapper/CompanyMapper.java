package com.anecacao.api.enterprise.data.mapper;

import com.anecacao.api.enterprise.data.entity.Company;
import com.anecacao.api.request.creation.data.dto.CompanyRequestDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyMapper {
    Company toCompanyEntity(CompanyRequestDTO dto);
}
