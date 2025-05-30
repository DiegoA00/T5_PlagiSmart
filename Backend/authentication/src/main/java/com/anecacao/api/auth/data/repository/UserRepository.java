package com.anecacao.api.auth.data.repository;

import com.anecacao.api.auth.data.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository <User, Long> {
    Optional<User> findByNationalId (String username);

    Boolean existsUserByNationalId (String username);

    Boolean existsUserByEmail (String email);

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByEmail(String email);
}