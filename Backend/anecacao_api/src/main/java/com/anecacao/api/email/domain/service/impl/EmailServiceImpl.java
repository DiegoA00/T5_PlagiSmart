package com.anecacao.api.email.domain.service.impl;

import com.anecacao.api.email.data.dto.EmailRequest;
import com.anecacao.api.email.domain.exception.EmailException;
import com.anecacao.api.email.domain.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendSimpleEmail(String to, String subject, String body) {
        try {
            logger.info("Enviando correo simple a: {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            logger.info("Correo simple enviado exitosamente a: {}", to);

        } catch (Exception e) {
            logger.error("Error al enviar correo simple a {}: {}", to, e.getMessage());
            throw new EmailException("Error al enviar el correo: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendHtmlEmail(EmailRequest emailRequest) throws MessagingException {
        try {
            logger.info("Enviando correo HTML a: {}", emailRequest.getTo());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(new InternetAddress(fromEmail));
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());

            // Configurar CC
            if (emailRequest.getCc() != null && !emailRequest.getCc().isEmpty()) {
                helper.setCc(emailRequest.getCc().toArray(new String[0]));
                logger.debug("CC agregados: {}", emailRequest.getCc());
            }

            // Configurar BCC
            if (emailRequest.getBcc() != null && !emailRequest.getBcc().isEmpty()) {
                helper.setBcc(emailRequest.getBcc().toArray(new String[0]));
                logger.debug("BCC agregados: {}", emailRequest.getBcc());
            }

            // Configurar prioridad
            if ("HIGH".equalsIgnoreCase(emailRequest.getPriority())) {
                message.setHeader("X-Priority", "1");
                message.setHeader("Importance", "High");
            } else if ("LOW".equalsIgnoreCase(emailRequest.getPriority())) {
                message.setHeader("X-Priority", "5");
                message.setHeader("Importance", "Low");
            }

            // Establecer el contenido
            helper.setText(emailRequest.getBody(), emailRequest.isHtml());

            mailSender.send(message);

            logger.info("Correo HTML enviado exitosamente a: {}", emailRequest.getTo());

        } catch (MessagingException e) {
            logger.error("Error al enviar correo HTML: {}", e.getMessage());
            throw new EmailException("Error al enviar el correo HTML: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendEmailWithAttachment(EmailRequest emailRequest) throws MessagingException {
        try {
            logger.info("Enviando correo con adjuntos a: {}", emailRequest.getTo());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

            helper.setFrom(new InternetAddress(fromEmail));
            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());
            helper.setText(emailRequest.getBody(), emailRequest.isHtml());

            // Agregar CC y BCC
            if (emailRequest.getCc() != null && !emailRequest.getCc().isEmpty()) {
                helper.setCc(emailRequest.getCc().toArray(new String[0]));
            }

            if (emailRequest.getBcc() != null && !emailRequest.getBcc().isEmpty()) {
                helper.setBcc(emailRequest.getBcc().toArray(new String[0]));
            }

            // Procesar archivos adjuntos
            if (emailRequest.getAttachments() != null) {
                for (Map.Entry<String, String> entry : emailRequest.getAttachments().entrySet()) {
                    String filename = entry.getKey();
                    String content = entry.getValue();

                    // Verificar si es Base64 o ruta de archivo
                    if (isBase64(content)) {
                        // Es Base64
                        byte[] decodedBytes = Base64.getDecoder().decode(content);
                        helper.addAttachment(filename, new ByteArrayResource(decodedBytes));
                        logger.debug("Adjunto Base64 agregado: {}", filename);
                    } else {
                        // Es ruta de archivo
                        FileSystemResource file = new FileSystemResource(new File(content));
                        if (file.exists()) {
                            helper.addAttachment(filename, file);
                            logger.debug("Archivo adjunto agregado: {}", filename);
                        } else {
                            logger.warn("Archivo no encontrado: {}", content);
                        }
                    }
                }
            }

            mailSender.send(message);

            logger.info("Correo con adjuntos enviado exitosamente a: {}", emailRequest.getTo());

        } catch (Exception e) {
            logger.error("Error al enviar correo con adjuntos: {}", e.getMessage());
            throw new EmailException("Error al enviar el correo con adjuntos: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendEmail(EmailRequest emailRequest) throws MessagingException {
        // Determinar qué tipo de correo enviar
        if (emailRequest.getAttachments() != null && !emailRequest.getAttachments().isEmpty()) {
            sendEmailWithAttachment(emailRequest);
        } else if (emailRequest.isHtml() ||
                (emailRequest.getCc() != null && !emailRequest.getCc().isEmpty()) ||
                (emailRequest.getBcc() != null && !emailRequest.getBcc().isEmpty())) {
            sendHtmlEmail(emailRequest);
        } else {
            sendSimpleEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
        }
    }

    @Override
    public boolean isValidEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Verifica si una cadena es Base64
     */
    private boolean isBase64(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Base64.getDecoder().decode(str);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}