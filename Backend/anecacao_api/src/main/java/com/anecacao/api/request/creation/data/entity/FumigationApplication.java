package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Data
public class FumigationApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Company company;

    @OneToMany(mappedBy = "fumigationApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Fumigation> fumigations;
}
