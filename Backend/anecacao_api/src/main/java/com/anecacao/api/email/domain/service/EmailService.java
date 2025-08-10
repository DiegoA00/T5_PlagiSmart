package com.anecacao.api.email.domain.service;

import com.anecacao.api.email.data.dto.EmailRequest;
import jakarta.mail.MessagingException;

public interface EmailService {

    /**
     * Envía un correo simple de texto plano
     */
    void sendSimpleEmail(String to, String subject, String body);

    /**
     * Envía un correo HTML
     */
    void sendHtmlEmail(EmailRequest emailRequest) throws MessagingException;

    /**
     * Envía un correo con archivos adjuntos
     */
    void sendEmailWithAttachment(EmailRequest emailRequest) throws MessagingException;

    /**
     * Envía un correo basado en el EmailRequest (detecta automáticamente el tipo)
     */
    void sendEmail(EmailRequest emailRequest) throws MessagingException;

    /**
     * Valida si una dirección de correo es válida
     */
    boolean isValidEmail(String email);
}