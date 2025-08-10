package com.anecacao.api.email.domain.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class EmailException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus status;

    public EmailException(String message) {
        super(message);
        this.errorCode = "EMAIL_ERROR";
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public EmailException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "EMAIL_ERROR";
        this.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public EmailException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
