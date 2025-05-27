package com.anecacao.authentication.data.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users_anecacao")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "national_id", unique = true)
    private String nationalId;

    @Column(unique = true)
    private String email;
    private String location;
    private LocalDateTime birthday;
    private String rol;

}
