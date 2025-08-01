package com.anecacao.api.reporting.data.entity;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
public class CleanupReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String stripsState;

    @Column(nullable = false)
    private Integer fumigationTime;

    @Column(nullable = false)
    private BigDecimal ppmFosfina;

    @Embedded
    @Column(nullable = false)
    private IndustrialSafetyConditions industrialSafetyConditions;

    @ManyToMany
    @JoinTable(
            name = "cleanup_technicians",
            joinColumns = @JoinColumn(name = "fumigation_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> technicians = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "fumigation_id", nullable = false, unique = true)
    private Fumigation fumigation;
}
