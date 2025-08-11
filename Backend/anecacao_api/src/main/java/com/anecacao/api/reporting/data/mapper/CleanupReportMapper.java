package com.anecacao.api.reporting.data.mapper;

import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.reporting.data.dto.*;
import com.anecacao.api.reporting.data.dto.response.CleanupReportResponseDTO;
import com.anecacao.api.reporting.data.dto.response.IndustrialSafetyConditionsResponseDTO;
import com.anecacao.api.reporting.data.dto.response.LotDescriptionResponseDTO;
import com.anecacao.api.reporting.data.entity.*;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.signature.data.dto.SignatureResponse;
import com.anecacao.api.signature.data.entity.Signature;
import com.anecacao.api.signature.data.repository.SignatureRepository;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CleanupReportMapper {

    private final SignatureRepository signatureRepository;

    public CleanupReportResponseDTO toResponseDTO(CleanupReport report) {
        if (report == null) {
            return null;
        }

        CleanupReportResponseDTO dto = new CleanupReportResponseDTO();

        // Basic fields
        dto.setId(report.getId());
        dto.setDate(report.getDate());
        dto.setStartTime(report.getStartTime());
        dto.setEndTime(report.getEndTime());

        // Map lot description
        dto.setLotDescription(toLotDescriptionResponseDTO(report));

        // Map industrial safety conditions
        dto.setIndustrialSafetyConditions(toIndustrialSafetyConditionsResponseDTO(report.getIndustrialSafetyConditions()));

        // Map technicians
        dto.setTechnicians(toUserDTOList(report.getTechnicians()));

        // Map fumigation info
        if (report.getFumigation() != null) {
            dto.setFumigationInfo(toFumigationInfoDTO(report.getFumigation()));
        }

        // Map signatures
        dto.setSignatures(getSignaturesForCleanupReport(report.getId()));

        return dto;
    }

    private List<SignatureResponse> getSignaturesForCleanupReport(Long reportId) {
        List<Signature> signatures = signatureRepository.findByCleanupReportId(reportId);
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

    private LotDescriptionResponseDTO toLotDescriptionResponseDTO(CleanupReport report) {
        LotDescriptionResponseDTO dto = new LotDescriptionResponseDTO();
        dto.setStripsState(report.getStripsState());
        dto.setFumigationTime(report.getFumigationTime());
        dto.setPpmFosfina(report.getPpmFosfina());

        return dto;
    }

    private IndustrialSafetyConditionsResponseDTO toIndustrialSafetyConditionsResponseDTO(IndustrialSafetyConditions conditions) {
        if (conditions == null) {
            return null;
        }

        IndustrialSafetyConditionsResponseDTO dto = new IndustrialSafetyConditionsResponseDTO();
        dto.setElectricDanger(Boolean.TRUE.equals(conditions.getElectricDanger()));
        dto.setFallingDanger(Boolean.TRUE.equals(conditions.getFallingDanger()));
        dto.setHitDanger(Boolean.TRUE.equals(conditions.getHitDanger()));
        dto.setOtherDanger(Boolean.TRUE.equals(conditions.getOtherDanger()));

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

    public List<CleanupReportResponseDTO> toResponseDTOList(List<CleanupReport> reports) {
        if (reports == null) {
            return null;
        }

        return reports.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}