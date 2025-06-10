package com.anecacao.api.auth.data.entity;

import com.anecacao.api.request.creation.data.entity.Company;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@Table(name = "users_anecacao")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String nationalId;

    @Column(unique = true)
    private String email;

    private String location;
    private LocalDate birthday;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    @OneToMany(mappedBy = "legalRepresentative", cascade = CascadeType.ALL)
    private Set<Company> companies;
}