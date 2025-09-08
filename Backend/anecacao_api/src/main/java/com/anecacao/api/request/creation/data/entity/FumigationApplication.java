package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class FumigationApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Company company;

    @Column(nullable = false)
    private LocalDate createdAt;

    @OneToMany(mappedBy = "fumigationApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fumigation> fumigations;
}
