package com.anecacao.api.request.creation.data.entity;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.reporting.data.entity.EnvironmentalConditions;
import com.anecacao.api.reporting.data.entity.IndustrialSafetyConditions;
import com.anecacao.api.reporting.data.entity.Supply;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    private String message;

    @Embedded
    private Dimensions dimensions;

    @Embedded
    private EnvironmentalConditions environmentalConditions;

    @Embedded
    private IndustrialSafetyConditions industrialSafetyConditions;

    @OneToMany(mappedBy = "fumigation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Supply> supplies = new ArrayList<>();

    private String observations;

    private String location;

    private LocalDate actualFumigationDate;

    private LocalTime startTime;

    private LocalTime endTime;

    @ManyToMany
    @JoinTable(
            name = "fumigation_technicians",
            joinColumns = @JoinColumn(name = "fumigation_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> technicians = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fumigation_application_id", nullable = false)
    @ToString.Exclude
    private FumigationApplication fumigationApplication;
}
