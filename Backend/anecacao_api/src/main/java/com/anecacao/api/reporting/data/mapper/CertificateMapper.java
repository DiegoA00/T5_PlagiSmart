package com.anecacao.api.reporting.data.mapper;

import com.anecacao.api.reporting.data.dto.response.CertificateDTO;
import com.anecacao.api.reporting.data.entity.CleanupReport;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import com.anecacao.api.reporting.data.entity.Supply;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class CertificateMapper {

    public CertificateDTO toCertificateDTO(Fumigation fumigation) {
        if (fumigation == null) {
            return null;
        }

        CertificateDTO.CertificateDTOBuilder builder = CertificateDTO.builder();

        // Datos básicos de la fumigación
        builder.quality(fumigation.getQuality());
        builder.fumigationDate(fumigation.getDateTime().toLocalDate());
        builder.lotNumber(fumigation.getLotNumber());
        builder.portDestination(fumigation.getPortDestination());

        // Razón social de la empresa (desde FumigationApplication -> Company)
        if (fumigation.getFumigationApplication() != null) {
            FumigationApplication application = fumigation.getFumigationApplication();

            // Razón social
            if (application.getCompany() != null) {
                builder.companyName(application.getCompany().getBusinessName());
            }
        }

        // Datos del FumigationReport (Supply y EnvironmentalConditions)
        FumigationReport fumigationReport = fumigation.getFumigationReport();
        if (fumigationReport != null) {
            // Temperatura ambiente
            if (fumigationReport.getEnvironmentalConditions() != null) {
                builder.ambientTemperature(fumigationReport.getEnvironmentalConditions().getTemperature());
            }

            // Datos del primer Supply (asumiendo que se usa el primero)
            List<Supply> supplies = fumigationReport.getSupplies();
            if (supplies != null && !supplies.isEmpty()) {
                Supply firstSupply = supplies.get(0);
                builder.productName(firstSupply.getName());
                builder.fumigationSystem(firstSupply.getKindOfSupply());
                builder.appliedDosage(firstSupply.getDosage());
            }
        }

        // Datos del CleanupReport
        CleanupReport cleanupReport = fumigation.getCleanupReport();
        if (cleanupReport != null) {
            builder.actionTime(cleanupReport.getFumigationTime());
            builder.phosphineMeasurement(cleanupReport.getPpmFosfina());
        }

        return builder.build();
    }

    /**
     * Método alternativo si necesitas pasar todos los reportes por separado
     */
    public CertificateDTO toCertificateDTO(Fumigation fumigation,
                                           FumigationReport fumigationReport,
                                           CleanupReport cleanupReport) {
        if (fumigation == null) {
            return null;
        }

        CertificateDTO.CertificateDTOBuilder builder = CertificateDTO.builder();

        // Datos básicos de la fumigación
        builder.quality(fumigation.getQuality());
        builder.fumigationDate(fumigation.getDateTime().toLocalDate());
        builder.lotNumber(fumigation.getLotNumber());
        builder.portDestination(fumigation.getPortDestination());

        // Razón social y fecha
        if (fumigation.getFumigationApplication() != null) {
            FumigationApplication application = fumigation.getFumigationApplication();

            if (application.getCompany() != null) {
                builder.companyName(application.getCompany().getBusinessName());
            }
        }

        // Datos del FumigationReport
        if (fumigationReport != null) {
            // Temperatura ambiente
            if (fumigationReport.getEnvironmentalConditions() != null) {
                builder.ambientTemperature(fumigationReport.getEnvironmentalConditions().getTemperature());
            }

            // Datos del primer Supply
            List<Supply> supplies = fumigationReport.getSupplies();
            if (supplies != null && !supplies.isEmpty()) {
                Supply firstSupply = supplies.get(0);
                builder.productName(firstSupply.getName());
                builder.fumigationSystem(firstSupply.getKindOfSupply());
                builder.appliedDosage(firstSupply.getDosage());
            }
        }

        // Datos del CleanupReport
        if (cleanupReport != null) {
            builder.actionTime(cleanupReport.getFumigationTime());
            builder.phosphineMeasurement(cleanupReport.getPpmFosfina());
            builder.cleanUpDate(cleanupReport.getDate());
        }

        return builder.build();
    }
}