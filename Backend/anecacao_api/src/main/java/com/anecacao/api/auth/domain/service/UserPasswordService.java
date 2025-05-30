package com.anecacao.api.auth.domain.service;

import com.anecacao.api.auth.data.entity.User;

public interface UserPasswordService {
    void savePassword (User user, String rawPassword);
}