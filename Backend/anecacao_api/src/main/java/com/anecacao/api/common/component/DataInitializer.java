package com.anecacao.api.common.component;

import com.anecacao.api.auth.data.entity.Role;
import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.repository.RoleRepository;
import com.anecacao.api.auth.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @Override
    public void run(ApplicationArguments args) {
        for (RoleName roleName : RoleName.values()) {
            roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(new Role(null, roleName)));
        }

        userService.createAdminUserIfNotExist();
    }
}
