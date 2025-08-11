package com.anecacao.api.auth.config.security;

import com.anecacao.api.auth.data.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Value("${FRONTEND_URL}")
    private String frontendURL;

    @Bean
    AuthenticationManager authenticationManager (AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder () {
        return new BCryptPasswordEncoder();
    }

    @Bean
    JwtAuthenticationFilter jwtAuthenticationFilter (CustomUserDetailsService userService, JwtProvider jwtProvider, UserRepository userRepository) {
        return new JwtAuthenticationFilter(userService, jwtProvider, userRepository);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource () {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendURL));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    SecurityFilterChain filterChain (HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/v3/api-docs",
                                "/v3/api/docs.yaml",
                                "/swagger-resources",
                                "/swagger-ui/**"
                        ).permitAll()

                        // ========== USERS ENDPOINTS ==========
                        .requestMatchers(HttpMethod.PUT, "/users/role").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.GET, "/users/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/me").authenticated()

                        // ========== FUMIGATION APPLICATIONS ENDPOINTS ==========
                        .requestMatchers(HttpMethod.POST, "/fumigation-applications").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.GET, "/fumigation-applications/{id}").hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fumigation-applications").hasAnyRole("ADMIN")

                        // ========== FUMIGATIONS ENDPOINTS ==========
                        .requestMatchers(HttpMethod.PUT, "/fumigations/{id}/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/fumigations/{id}").hasAnyRole("CLIENT", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/fumigations").hasAnyRole("ADMIN", "TECHNICIAN", "CLIENT")
                        .requestMatchers(HttpMethod.GET, "/fumigations/info/{id}").hasAnyRole("CLIENT", "TECHNICIAN", "ADMIN")

                        // ========== REPORTS ENDPOINTS - CREACIÓN ==========
                        .requestMatchers(HttpMethod.POST, "/reports/fumigations").hasRole("TECHNICIAN")
                        .requestMatchers(HttpMethod.POST, "/reports/cleanup").hasRole("TECHNICIAN")

                        // ========== REPORTS ENDPOINTS - FUMIGATION REPORTS (LECTURA) ==========
                        .requestMatchers(HttpMethod.GET, "/reports/fumigations").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.GET, "/reports/fumigations/by-fumigation/*").hasAnyRole("ADMIN", "TECHNICIAN", "CLIENT")
                        .requestMatchers(HttpMethod.GET, "/reports/fumigations/*").hasAnyRole("ADMIN", "TECHNICIAN", "CLIENT")

                        // ========== REPORTS ENDPOINTS - CLEANUP REPORTS (LECTURA) ==========
                        .requestMatchers(HttpMethod.GET, "/reports/cleanup").hasAnyRole("ADMIN", "TECHNICIAN")
                        .requestMatchers(HttpMethod.GET, "/reports/cleanup/by-fumigation/*").hasAnyRole("ADMIN", "TECHNICIAN", "CLIENT")
                        .requestMatchers(HttpMethod.GET, "/reports/cleanup/*").hasAnyRole("ADMIN", "TECHNICIAN", "CLIENT")


                        // ========== SIGNATURES ENDPOINTS ==========
                        .requestMatchers(HttpMethod.POST, "api/signatures").hasRole("TECHNICIAN")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}