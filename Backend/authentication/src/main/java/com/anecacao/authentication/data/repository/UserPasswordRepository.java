package com.anecacao.authentication.data.repository;

import com.anecacao.authentication.data.entity.User;
import com.anecacao.authentication.data.entity.UserPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPasswordRepository extends JpaRepository<UserPassword, Long> {
    List<UserPassword> findUserPasswordByUser(User user);
}