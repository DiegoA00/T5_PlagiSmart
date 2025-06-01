package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.*;

public class PortDestination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    @Column(nullable = true, unique = true)
    private PortName portName;
}
