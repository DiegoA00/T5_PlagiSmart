package com.anecacao.api.request.creation.data.entity;
import com.anecacao.api.enterprise.data.entity.Company;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class FumigationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Company company;
}
