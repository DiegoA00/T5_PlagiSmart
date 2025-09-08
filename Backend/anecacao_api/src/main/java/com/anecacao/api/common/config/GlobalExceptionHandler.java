package com.anecacao.api.common.config;

import com.anecacao.api.auth.data.dto.ErrorResponseDTO;
import com.anecacao.api.auth.domain.exception.*;
import com.anecacao.api.reporting.domain.exception.IndustrialSafetyViolationException;
import com.anecacao.api.reporting.domain.exception.InvalidFumigationStatusException;
import com.anecacao.api.reporting.domain.service.exception.TechnicalRoleException;
import com.anecacao.api.request.creation.domain.exception.CompanyNotFoundException;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import com.anecacao.api.request.creation.domain.exception.FumigationValidationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.anecacao.api.request.creation.domain.exception.FumigationApplicationNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

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

    @ExceptionHandler (FumigationValidationException.class)
    public ResponseEntity<ErrorResponseDTO> handleFumigationValidationException (FumigationValidationException ex) {
        return new ResponseEntity <> (buildResponse(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponseDTO> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        String message = "Malformed request body.";

        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException formatException) {
            String fieldName = formatException.getPath().stream()
                    .map(JsonMappingException.Reference::getFieldName)
                    .collect(Collectors.joining("."));

            String invalidValue = formatException.getValue() != null
                    ? formatException.getValue().toString()
                    : "null";

            Class<?> targetType = formatException.getTargetType();

            if (targetType.isEnum()) {
                String allowedValues = String.join(", ",
                        Arrays.stream(targetType.getEnumConstants())
                                .map(Object::toString)
                                .collect(Collectors.toList()));

                message = String.format(
                        "Invalid value '%s' for field '%s'. Allowed values: %s.",
                        invalidValue, fieldName, allowedValues
                );
            } else {
                message = String.format(
                        "Invalid value '%s' for field '%s'. Expected type: %s.",
                        invalidValue, fieldName, targetType.getSimpleName()
                );
            }
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(buildResponse(message));
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

    @ExceptionHandler (CompanyNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleCompanyNotFoundException (CompanyNotFoundException ex) {
        return new ResponseEntity <> (buildResponse(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ErrorResponseDTO> handleUnauthorizedAccessException(UnauthorizedAccessException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(FumigationNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleFumigationNotFoundException(FumigationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(FumigationApplicationNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleFumigationApplicationNotFoundException(FumigationApplicationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(IllegalRoleChangeException.class)
    public ResponseEntity<ErrorResponseDTO> handleIllegalRoleChangeException(IllegalRoleChangeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(IndustrialSafetyViolationException.class)
    public ResponseEntity<ErrorResponseDTO> handleIndustrialSafetyViolationException(IndustrialSafetyViolationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(InvalidFumigationStatusException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalidFumigationStatusException(InvalidFumigationStatusException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(CompanyAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleCompanyAlreadyExistsException(CompanyAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(TechnicalRoleException.class)
    public ResponseEntity<ErrorResponseDTO> handleTechnicalRoleException(TechnicalRoleException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(buildResponse(ex.getMessage()));
    }

    @ExceptionHandler(UserInvalidException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserInvalidException(UserInvalidException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(buildResponse(ex.getMessage()));
    }

    private ErrorResponseDTO buildResponse (String message) {
        ErrorResponseDTO error = new ErrorResponseDTO();
        error.setMessage(message);
        return error;
    }
}
