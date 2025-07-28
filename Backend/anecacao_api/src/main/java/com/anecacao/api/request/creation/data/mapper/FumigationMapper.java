package com.anecacao.api.request.creation.data.mapper;

import com.anecacao.api.request.creation.data.dto.response.FumigationResponseDTO;
import com.anecacao.api.request.creation.data.dto.response.FumigationSummaryDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring")
public interface FumigationMapper {

    FumigationResponseDTO toResponseDto(Fumigation fumigation);

    @Mapping(target = "time", expression = "java(formatTime(fumigation.getDateTime()))")
    FumigationSummaryDTO toSummaryDto(Fumigation fumigation);

    List<FumigationSummaryDTO> toSummaryDtoList(List<Fumigation> fumigations);

    default String formatTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}