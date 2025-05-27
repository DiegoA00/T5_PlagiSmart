package com.anecacao.authentication.data.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

@Table(name = "user_password")
public class UserPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hashed_password")
    private String hashedPassword;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
