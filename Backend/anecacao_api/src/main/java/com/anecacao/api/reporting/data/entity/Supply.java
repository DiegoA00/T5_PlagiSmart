package com.anecacao.api.reporting.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
public class Supply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String dosage;

    @Column(nullable = false)
    private String kindOfSupply;

    @Column(nullable = false)
    private String numberOfStrips;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fumigation_report_id")
    private FumigationReport fumigationReport;
}
