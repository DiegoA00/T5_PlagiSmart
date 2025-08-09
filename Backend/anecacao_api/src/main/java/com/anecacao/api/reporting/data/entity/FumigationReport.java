package com.anecacao.api.reporting.data.entity;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.Dimensions;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
public class FumigationReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Embedded
    @Column(nullable = false)
    private EnvironmentalConditions environmentalConditions;

    @Embedded
    @Column(nullable = false)
    private IndustrialSafetyConditions industrialSafetyConditions;

    @Embedded
    @Column(nullable = false)
    private Dimensions dimensions;

    private String supervisor;

    private String observations;

    @ManyToMany
    @JoinTable(
            name = "fumigation_technicians",
            joinColumns = @JoinColumn(name = "fumigation_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> technicians = new HashSet<>();

    @OneToMany(mappedBy = "fumigationReport", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Supply> supplies = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "fumigation_id", nullable = false, unique = true)
    private Fumigation fumigation;
}
