package com.anecacao.api.reporting.data.mapper;

import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.reporting.data.dto.*;
import com.anecacao.api.reporting.data.dto.response.FumigationReportResponseDTO;
import com.anecacao.api.reporting.data.entity.*;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.Dimensions;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.signature.data.dto.SignatureResponse;
import com.anecacao.api.signature.data.entity.Signature;
import com.anecacao.api.signature.data.repository.SignatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FumigationReportMapper {

    private final SignatureRepository signatureRepository;

    public FumigationReportResponseDTO toResponseDTO(FumigationReport report) {
        if (report == null) {
            return null;
        }

        FumigationReportResponseDTO dto = new FumigationReportResponseDTO();

        // Basic fields
        dto.setId(report.getId());
        dto.setLocation(report.getLocation());
        dto.setDate(report.getDate());
        dto.setStartTime(report.getStartTime());
        dto.setEndTime(report.getEndTime());
        dto.setObservations(report.getObservations());

        // Map dimensions
        if (report.getDimensions() != null) {
            dto.setDimensions(toDimensionsDTO(report.getDimensions()));
        }

        // Map Supervisor
        if (report.getSupervisor() != null) {
            dto.setSupervisor(report.getSupervisor());
        }

        // Map environmental conditions - verificar null
        if (report.getEnvironmentalConditions() != null) {
            dto.setEnvironmentalConditions(toEnvironmentalConditionsDTO(report.getEnvironmentalConditions()));
        }

        // Map industrial safety conditions - verificar null
        if (report.getIndustrialSafetyConditions() != null) {
            dto.setIndustrialSafetyConditions(toIndustrialSafetyConditionsDTO(report.getIndustrialSafetyConditions()));
        }

        // Map technicians - manejar lazy loading
        if (report.getTechnicians() != null && !report.getTechnicians().isEmpty()) {
            dto.setTechnicians(toUserDTOList(report.getTechnicians()));
        }

        // Map supplies - manejar lazy loading
        if (report.getSupplies() != null && !report.getSupplies().isEmpty()) {
            dto.setSupplies(toSupplyDTOList(report.getSupplies()));
        }

        // Map fumigation info - manejar lazy loading
        if (report.getFumigation() != null) {
            dto.setFumigationInfo(toFumigationInfoDTO(report.getFumigation()));
        }

        // Map signatures
        dto.setSignatures(getSignaturesForFumigationReport(report.getId()));

        return dto;
    }

    private List<SignatureResponse> getSignaturesForFumigationReport(Long reportId) {
        List<Signature> signatures = signatureRepository.findByFumigationReportId(reportId);
        return signatures.stream()
                .map(this::toSignatureResponse)
                .collect(Collectors.toList());
    }

    private SignatureResponse toSignatureResponse(Signature signature) {
        Long reportId = signature.getFumigationReport() != null
                ? signature.getFumigationReport().getId()
                : signature.getCleanupReport() != null
                ? signature.getCleanupReport().getId()
                : null;

        return new SignatureResponse(
                signature.getId(),
                signature.getSignatureType(),
                signature.getFilePath(),
                reportId
        );
    }

    private DimensionsDTO toDimensionsDTO(Dimensions dimensions) {
        if (dimensions == null) {
            return null;
        }

        DimensionsDTO dto = new DimensionsDTO();
        dto.setHeight(dimensions.getHeight());
        dto.setWidth(dimensions.getWidth());
        dto.setLength(dimensions.getLength());

        return dto;
    }

    private EnvironmentalConditionsDTO toEnvironmentalConditionsDTO(EnvironmentalConditions conditions) {
        if (conditions == null) {
            return null;
        }

        EnvironmentalConditionsDTO dto = new EnvironmentalConditionsDTO();
        dto.setTemperature(conditions.getTemperature());
        dto.setHumidity(conditions.getHumidity());

        return dto;
    }

    private IndustrialSafetyConditionsDTO toIndustrialSafetyConditionsDTO(IndustrialSafetyConditions conditions) {
        if (conditions == null) {
            return null;
        }

        IndustrialSafetyConditionsDTO dto = new IndustrialSafetyConditionsDTO();
        dto.setElectricDanger(Boolean.TRUE.equals(conditions.getElectricDanger()));
        dto.setFallingDanger(Boolean.TRUE.equals(conditions.getFallingDanger()));
        dto.setHitDanger(Boolean.TRUE.equals(conditions.getHitDanger()));

        return dto;
    }

    private List<UserResponseDTO> toUserDTOList(Set<User> technicians) {
        if (technicians == null) {
            return null;
        }

        return technicians.stream()
                .map(this::toUserResponseDTO)
                .collect(Collectors.toList());
    }

    private UserResponseDTO toUserResponseDTO(User user) {
        if (user == null) {
            return null;
        }

        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setNationalId(user.getNationalId());

        return dto;
    }

    private List<SupplyDTO> toSupplyDTOList(List<Supply> supplies) {
        if (supplies == null) {
            return null;
        }

        return supplies.stream()
                .map(this::toSupplyDTO)
                .collect(Collectors.toList());
    }

    private SupplyDTO toSupplyDTO(Supply supply) {
        if (supply == null) {
            return null;
        }

        SupplyDTO dto = new SupplyDTO();
        dto.setId(supply.getId());
        dto.setName(supply.getName());
        dto.setQuantity(supply.getQuantity());
        dto.setDosage(supply.getDosage());
        dto.setKindOfSupply(supply.getKindOfSupply());
        dto.setNumberOfStrips(supply.getNumberOfStrips());

        return dto;
    }

    private FumigationInfoDTO toFumigationInfoDTO(Fumigation fumigation) {
        if (fumigation == null) {
            return null;
        }

        FumigationInfoDTO dto = new FumigationInfoDTO();
        dto.setId(fumigation.getId());
        dto.setLotNumber(fumigation.getLotNumber());
        dto.setTon(fumigation.getTon());
        dto.setPortDestination(fumigation.getPortDestination());
        dto.setSacks(fumigation.getSacks());
        dto.setQuality(fumigation.getQuality());
        dto.setDateTime(fumigation.getDateTime());
        dto.setStatus(fumigation.getStatus());
        dto.setMessage(fumigation.getMessage());

        return dto;
    }

    public List<FumigationReportResponseDTO> toResponseDTOList(List<FumigationReport> reports) {
        if (reports == null) {
            return null;
        }

        return reports.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}
