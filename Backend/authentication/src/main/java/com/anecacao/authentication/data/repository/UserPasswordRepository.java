package com.anecacao.authentication.data.repository;

import com.anecacao.authentication.data.entity.User;
import com.anecacao.authentication.data.entity.UserPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPasswordRepository extends JpaRepository<UserPassword, Long> {
    Optional<UserPassword> findUserPasswordByUser(User user);
}