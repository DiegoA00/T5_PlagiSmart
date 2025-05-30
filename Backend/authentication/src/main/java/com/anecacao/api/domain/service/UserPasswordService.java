package com.anecacao.api.domain.service;

import com.anecacao.api.data.entity.User;

public interface UserPasswordService {
    void savePassword (User user, String rawPassword);
}