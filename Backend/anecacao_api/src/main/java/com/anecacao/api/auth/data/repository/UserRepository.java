package com.anecacao.api.auth.data.repository;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository <User, Long> {
    boolean existsByNationalIdAndIdNot(String nationalId, Long userId);

    boolean existsUserByEmail (String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    Page<User> findByRoleName(@Param("roleName") RoleName roleName, Pageable pageable);
}