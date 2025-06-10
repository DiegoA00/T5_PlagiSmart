package com.anecacao.api.auth.domain.service.impl;

import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.data.entity.UserPassword;
import com.anecacao.api.auth.data.repository.UserPasswordRepository;
import com.anecacao.api.auth.domain.service.UserPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserPasswordServiceImpl implements UserPasswordService {
    private final UserPasswordRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void savePassword (User user, String rawPassword) {
        UserPassword password = new UserPassword();
        password.setUser(user);
        password.setHashedPassword(passwordEncoder.encode(rawPassword));
        repository.save(password);
    }
}