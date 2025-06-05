package com.anecacao.api.request.creation.data.entity;

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
    private BigDecimal ton;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PortName portDestination;

    @Column(nullable = false)
    private Long sacks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Grade grade;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fumigation_application_id", nullable = false)
    @ToString.Exclude
    private FumigationApplication fumigationApplication;
}
