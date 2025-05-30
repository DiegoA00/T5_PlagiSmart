package com.anecacao.api.auth.config.security;

import com.anecacao.api.auth.data.dto.UserDTO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtProvider {
    private long EXPIRATION_TIME;
    private final SecretKey key;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public JwtProvider(@Value("${SECURITY_CONSTANT}") String securityConstant, @Value("${EXPIRATION_TIME}") Long expirationTime) {
        this.key = Keys.hmacShaKeyFor(securityConstant.getBytes(StandardCharsets.UTF_8));
        this.EXPIRATION_TIME = expirationTime;
    }

    public String generateToken (Authentication authentication) {
        String email = authentication.getName();
        UserDTO user = customUserDetailsService.loadUserBasicDTOByEmail(email);
        Date currentTime = new Date ();
        Date expirationTime = new Date (currentTime.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(currentTime)
                .setExpiration(expirationTime)
                .claim("id", user.getId())
                .claim("nationalId", user.getNationalId())
                .claim("email", user.getEmail())
                .claim("name", user.getFirstName())
                .claim("lastName", user.getLastName())
                .claim("email", user.getEmail())
                .claim("location", user.getLocation())
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getEmailFromJWT (String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken (String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;
        } catch (ExpiredJwtException ex) {
            throw ex;
        } catch (JwtException ex) {
            throw new AuthenticationCredentialsNotFoundException("Invalid JWT token: " + ex.getMessage());
        }
    }
}
