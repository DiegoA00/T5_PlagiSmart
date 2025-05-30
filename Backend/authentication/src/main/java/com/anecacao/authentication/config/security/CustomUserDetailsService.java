package com.anecacao.authentication.config.security;

import com.anecacao.authentication.data.dto.UserDTO;
import com.anecacao.authentication.data.entity.Role;
import com.anecacao.authentication.data.entity.User;
import com.anecacao.authentication.data.entity.UserPassword;
import com.anecacao.authentication.data.mapper.UserMapper;
import com.anecacao.authentication.data.repository.UserPasswordRepository;
import com.anecacao.authentication.data.repository.UserRepository;
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
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByNationalId(username).orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + " not found"));
        UserPassword password = userPasswordRepository.findUserPasswordByUser(user)
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No valid password found for user"));

        return new org.springframework.security.core.userdetails.User(
                user.getNationalId(),
                password.getHashedPassword(),
                mapToAuthorities(user.getRoles())
        );
    }

     private Collection<GrantedAuthority> mapToAuthorities (Set<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());
     }

    public UserDTO loadUserBasicDTOByUsername (String nationalId) {
        return userMapper.userToUserDTO(userRepository.findByNationalId(nationalId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found.")));
    }
}