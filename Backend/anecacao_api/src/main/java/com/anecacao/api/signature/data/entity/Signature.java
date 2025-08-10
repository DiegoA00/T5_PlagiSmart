package com.anecacao.api.signature.data.entity;

import com.anecacao.api.reporting.data.entity.CleanupReport;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Signature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fumigation_report_id")
    private FumigationReport fumigationReport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cleanup_report_id")
    private CleanupReport cleanupReport;

    @Column(nullable = false)
    private String signatureType;

    @Column(nullable = false)
    private String filePath;
}
