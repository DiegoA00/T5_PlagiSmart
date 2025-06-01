package com.anecacao.api.enterprise.data.entity;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Data
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String ruc;

    @Column(nullable = false)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User legalRepresentative;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FumigationApplication> fumigationApplications;
}
