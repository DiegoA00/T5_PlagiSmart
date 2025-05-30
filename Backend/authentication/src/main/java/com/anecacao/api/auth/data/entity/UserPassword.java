package com.anecacao.api.auth.data.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user_password")
public class UserPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hashedPassword;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;
}
