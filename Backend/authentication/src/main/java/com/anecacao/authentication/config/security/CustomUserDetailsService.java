package com.anecacao.authentication.config.security;

import com.anecacao.authentication.data.entity.User;
import com.anecacao.authentication.data.entity.UserPassword;
import com.anecacao.authentication.data.mapper.UserMapper;
import com.anecacao.authentication.data.repository.UserPasswordRepository;
import com.anecacao.authentication.data.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserPasswordRepository userPasswordRepository;
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByNationalId(username).orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + " not found"));
        UserPassword password = userPasswordRepository.findUserPasswordByUser(user)
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No valid password found for user"));

        String role = user.getRole();

        return new org.springframework.security.core.userdetails.User(
                user.getNationalId(),
                password.getHashedPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE" + role))
        );
    }
}