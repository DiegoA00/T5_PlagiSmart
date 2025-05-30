package com.anecacao.api;

import com.anecacao.api.data.entity.Role;
import com.anecacao.api.data.entity.RoleName;
import com.anecacao.api.data.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AuthenticationApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthenticationApiApplication.class, args);
	}

	@Bean
	CommandLineRunner initRoles(RoleRepository roleRepository) {
		return args -> {
			for (RoleName roleName : RoleName.values()) {
				roleRepository.findByName(roleName)
						.orElseGet(() -> roleRepository.save(new Role(null, roleName)));
			}
		};
	}
}
