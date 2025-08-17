package com.anecacao.api.reporting.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDTO {
    private String companyName;           // Razón social de la empresa
    private LocalDate fumigationDate;     // Fecha de fumigación
    private String quality;               // Tipo/Clase de Cacao
    private String lotNumber;             // No. LOTE
    private String portDestination;       // PAÍS/CIUDAD DE DESTINO
    private String productName;           // NOMBRE DEL PRODUCTO UTILIZADO (de Supply)
    private String fumigationSystem;      // SISTEMA DE FUMIGACIÓN (kindOfSupply de Supply)
    private Integer actionTime;           // TIEMPO DE ACCIÓN (fumigationTime de CleanupReport)
    private String appliedDosage;         // DOSIS APLICADA (dosage de Supply)
    private BigDecimal ambientTemperature; // TEMPERATURA AMBIENTE (de EnvironmentalConditions)
    private BigDecimal phosphineMeasurement; // MEDICIÓN DE FOSFINA (ppmFosfina de CleanupReport)
    private LocalDate cleanUpDate;         // Fecha de Descarpe
}