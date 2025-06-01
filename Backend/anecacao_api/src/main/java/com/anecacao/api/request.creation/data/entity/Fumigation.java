package com.anecacao.api.request.creation.data.entity;

import jakarta.persistence.*;
import lombok.Data;

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

    @OneToOne
    @JoinColumn(name = "port_destination_id", referencedColumnName = "id")
    private PortDestination portDestination;

    @Column(nullable = false)
    private Long sacks;

    @Column(nullable = false)
    private Integer grade;

    @Column(nullable = false)
    private LocalDateTime dateTime;

}
