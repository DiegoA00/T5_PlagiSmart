package com.anecacao.api.auth.config;

import com.anecacao.api.auth.data.dto.ErrorResponseDTO;
import com.anecacao.api.auth.domain.exception.RoleNotFoundException;
import com.anecacao.api.auth.domain.exception.UserAlreadyExistsException;
import com.anecacao.api.auth.domain.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler (MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors (MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return new ResponseEntity <> (errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler (UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserAlreadyExistsException (UserAlreadyExistsException ex) {
        return new ResponseEntity <> (buildResponse(ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler (UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserNotFoundException (UserNotFoundException ex) {
        return new ResponseEntity <> (buildResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler (RoleNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleRoleNotFoundException (RoleNotFoundException ex) {
        return new ResponseEntity <> (buildResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler (UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUsernameNotFoundException (UsernameNotFoundException ex) {
        return new ResponseEntity <> (buildResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    private ErrorResponseDTO buildResponse (String message) {
        ErrorResponseDTO error = new ErrorResponseDTO();
        error.setMessage(message);
        return error;
    }
}
