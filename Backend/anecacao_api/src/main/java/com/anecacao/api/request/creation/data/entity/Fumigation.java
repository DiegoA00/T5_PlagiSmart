package com.anecacao.api.request.creation.data.entity;

import com.anecacao.api.reporting.data.entity.CleanupReport;
import com.anecacao.api.reporting.data.entity.FumigationReport;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
public class Fumigation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String lotNumber;

    @Column(nullable = false)
    private BigDecimal ton;

    @Column(nullable = false)
    private String portDestination;

    @Column(nullable = false)
    private Long sacks;

    @Column(nullable = false)
    private String quality;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fumigation_application_id", nullable = false)
    @ToString.Exclude
    private FumigationApplication fumigationApplication;

    @OneToOne(mappedBy = "fumigation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private FumigationReport fumigationReport;

    @OneToOne(mappedBy = "fumigation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private CleanupReport cleanupReport;
}
