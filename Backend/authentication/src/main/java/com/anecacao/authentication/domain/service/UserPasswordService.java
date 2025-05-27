package com.anecacao.authentication.domain.service;

import com.anecacao.authentication.data.entity.User;

public interface UserPasswordService {
    void savePassword (User user, String rawPassword);
}