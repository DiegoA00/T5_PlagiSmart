package com.anecacao.api.config.security;

import com.anecacao.api.data.dto.UserDTO;
import com.anecacao.api.data.entity.Role;
import com.anecacao.api.data.entity.User;
import com.anecacao.api.data.entity.UserPassword;
import com.anecacao.api.data.mapper.UserMapper;
import com.anecacao.api.data.repository.UserPasswordRepository;
import com.anecacao.api.data.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserPasswordRepository userPasswordRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User with email: " + email + " not found"));
        UserPassword password = userPasswordRepository.findUserPasswordByUser(user)
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No valid password found for user"));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                password.getHashedPassword(),
                mapToAuthorities(user.getRoles())
        );
    }

     private Collection<GrantedAuthority> mapToAuthorities (Set<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toSet());
     }

    public UserDTO loadUserBasicDTOByEmail (String email) {
        return userMapper.userToUserDTO(userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found.")));
    }
}