package com.anecacao.authentication.domain.service.impl;

import com.anecacao.authentication.data.entity.User;
import com.anecacao.authentication.data.entity.UserPassword;
import com.anecacao.authentication.data.repository.UserPasswordRepository;
import com.anecacao.authentication.domain.service.UserPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserPasswordServiceImpl implements UserPasswordService {
    private final UserPasswordRepository repository;

    @Override
    public void savePassword (User user, String rawPassword) {
        UserPassword password = new UserPassword();
        password.setUser(user);
        password.setHashedPassword(rawPassword); // temp
        // password.setHashedPassword(encoder.encode(rawPassword));
        repository.save(password);
    }
}