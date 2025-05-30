package com.anecacao.api.auth.data.repository;

import com.anecacao.api.auth.data.entity.Role;
import com.anecacao.api.auth.data.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
