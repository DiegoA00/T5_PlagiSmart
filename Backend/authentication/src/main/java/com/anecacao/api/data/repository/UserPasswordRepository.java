package com.anecacao.api.data.repository;

import com.anecacao.api.data.entity.User;
import com.anecacao.api.data.entity.UserPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPasswordRepository extends JpaRepository<UserPassword, Long> {
    Optional<UserPassword> findUserPasswordByUser(User user);
}