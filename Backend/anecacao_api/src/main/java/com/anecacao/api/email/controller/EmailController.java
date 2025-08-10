package com.anecacao.api.email.controller;

import com.anecacao.api.email.data.dto.EmailRequest;
import com.anecacao.api.email.domain.exception.EmailException;
import com.anecacao.api.email.domain.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/email")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmailController {

    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);

    @Autowired
    private EmailService emailService;

    /**
     * Endpoint POST para enviar correo
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendEmail(@Valid @RequestBody EmailRequest emailRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Solicitud de envío de correo recibida: {}", emailRequest);

            // Validar email del destinatario
            if (!emailService.isValidEmail(emailRequest.getTo())) {
                response.put("success", false);
                response.put("message", "La dirección de correo del destinatario no es válida");
                response.put("timestamp", LocalDateTime.now());
                return ResponseEntity.badRequest().body(response);
            }

            // Enviar correo
            emailService.sendEmail(emailRequest);

            response.put("success", true);
            response.put("message", "Correo enviado exitosamente");
            response.put("recipient", emailRequest.getTo());
            response.put("subject", emailRequest.getSubject());
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (MessagingException e) {
            logger.error("Error de mensajería al enviar correo: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Error al enviar el correo: " + e.getMessage());
            response.put("error", "MESSAGING_ERROR");
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);

        } catch (EmailException e) {
            logger.error("Error de email: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("error", e.getErrorCode());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(e.getStatus()).body(response);

        } catch (Exception e) {
            logger.error("Error inesperado: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Error interno del servidor");
            response.put("error", "INTERNAL_ERROR");
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint PUT para actualizar y reenviar correo
     */
    @PutMapping("/resend/{emailId}")
    public ResponseEntity<Map<String, Object>> resendEmail(
            @PathVariable String emailId,
            @Valid @RequestBody EmailRequest emailRequest) {

        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Solicitud de reenvío de correo ID: {}", emailId);

            // Aquí podrías implementar lógica adicional para:
            // 1. Recuperar información del correo anterior (si tienes BD)
            // 2. Actualizar campos específicos
            // 3. Mantener un registro del reenvío

            emailService.sendEmail(emailRequest);

            response.put("success", true);
            response.put("message", "Correo reenviado exitosamente");
            response.put("emailId", emailId);
            response.put("recipient", emailRequest.getTo());
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error al reenviar correo: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Error al reenviar el correo: " + e.getMessage());
            response.put("emailId", emailId);
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint POST para enviar correo con plantilla predefinida
     */
    @PostMapping("/send-template/{templateName}")
    public ResponseEntity<Map<String, Object>> sendTemplateEmail(
            @PathVariable String templateName,
            @Valid @RequestBody EmailRequest emailRequest) {

        Map<String, Object> response = new HashMap<>();

        try {
            logger.info("Enviando correo con plantilla: {}", templateName);

            // Aplicar plantilla según el nombre
            String htmlContent = applyTemplate(templateName, emailRequest);
            emailRequest.setBody(htmlContent);
            emailRequest.setHtml(true);

            emailService.sendEmail(emailRequest);

            response.put("success", true);
            response.put("message", "Correo con plantilla enviado exitosamente");
            response.put("template", templateName);
            response.put("recipient", emailRequest.getTo());
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error al enviar correo con plantilla: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Error al enviar el correo: " + e.getMessage());
            response.put("template", templateName);
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint POST para enviar correo masivo (múltiples destinatarios)
     */
    @PostMapping("/send-bulk")
    public ResponseEntity<Map<String, Object>> sendBulkEmail(@Valid @RequestBody Map<String, Object> bulkRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            @SuppressWarnings("unchecked")
            java.util.List<String> recipients = (java.util.List<String>) bulkRequest.get("recipients");
            String subject = (String) bulkRequest.get("subject");
            String body = (String) bulkRequest.get("body");
            Boolean isHtml = (Boolean) bulkRequest.getOrDefault("isHtml", false);

            int successCount = 0;
            int failureCount = 0;
            java.util.List<String> failedRecipients = new java.util.ArrayList<>();

            for (String recipient : recipients) {
                try {
                    EmailRequest emailRequest = new EmailRequest(recipient, subject, body, isHtml);
                    emailService.sendEmail(emailRequest);
                    successCount++;
                    logger.info("Correo enviado exitosamente a: {}", recipient);
                } catch (Exception e) {
                    failureCount++;
                    failedRecipients.add(recipient);
                    logger.error("Error al enviar correo a {}: {}", recipient, e.getMessage());
                }
            }

            response.put("success", true);
            response.put("totalRecipients", recipients.size());
            response.put("successCount", successCount);
            response.put("failureCount", failureCount);
            if (!failedRecipients.isEmpty()) {
                response.put("failedRecipients", failedRecipients);
            }
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error al enviar correo masivo: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Error al enviar correos masivos: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint GET para verificar el estado del servicio
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Email Service");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint POST para validar una dirección de correo
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateEmail(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            response.put("valid", false);
            response.put("message", "El correo electrónico no puede estar vacío");
            return ResponseEntity.badRequest().body(response);
        }

        boolean isValid = emailService.isValidEmail(email);
        response.put("valid", isValid);
        response.put("email", email);
        response.put("message", isValid ? "Correo electrónico válido" : "Correo electrónico inválido");

        return ResponseEntity.ok(response);
    }

    private String applyTemplate(String templateName, EmailRequest emailRequest) {
        return switch (templateName.toLowerCase()) {
            // Plantillas existentes...
            case "welcome" -> getWelcomeTemplate(emailRequest);
            // ... otras plantillas existentes ...

            // NUEVAS PLANTILLAS PARA FUMIGACIÓN
            case "fumigation-application-received" -> getFumigationApplicationReceivedTemplate(emailRequest);
            case "fumigation-status-changed" -> getFumigationStatusChangedTemplate(emailRequest);
            case "fumigation-updated" -> getFumigationUpdatedTemplate(emailRequest);
            case "fumigation-report-created" -> getFumigationReportCreatedTemplate(emailRequest);
            case "cleanup-report-created" -> getCleanupReportCreatedTemplate(emailRequest);
            default -> getDefaultTemplate(emailRequest);
        };
    }

    private String getWelcomeTemplate(EmailRequest emailRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 40px 20px; text-align: center; }
                    .content { padding: 40px 20px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Bienvenido!</h1>
                    </div>
                    <div class="content">
                        <h2>%s</h2>
                        <p>%s</p>
                        <a href="#" class="button">Comenzar</a>
                    </div>
                    <div class="footer">
                        <p>Este es un correo automático, por favor no responder.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emailRequest.getSubject(), emailRequest.getBody());
    }

    private String getNotificationTemplate(EmailRequest emailRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f0f2f5; margin: 0; padding: 20px; }
                    .notification { max-width: 500px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .notification-header { background-color: #4267B2; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
                    .notification-body { padding: 20px; }
                    .notification-footer { padding: 15px 20px; background-color: #f8f9fa; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="notification">
                    <div class="notification-header">
                        <h2>📬 Notificación</h2>
                    </div>
                    <div class="notification-body">
                        <h3>%s</h3>
                        <p>%s</p>
                    </div>
                    <div class="notification-footer">
                        <small>Enviado el %s</small>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emailRequest.getSubject(), emailRequest.getBody(), LocalDateTime.now());
    }

    private String getAlertTemplate(EmailRequest emailRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #fff; margin: 0; padding: 20px; }
                    .alert { max-width: 600px; margin: 0 auto; border: 2px solid #dc3545; border-radius: 5px; }
                    .alert-header { background-color: #dc3545; color: white; padding: 15px; }
                    .alert-body { padding: 20px; background-color: #f8d7da; color: #721c24; }
                </style>
            </head>
            <body>
                <div class="alert">
                    <div class="alert-header">
                        <h2>⚠️ Alerta Importante</h2>
                    </div>
                    <div class="alert-body">
                        <h3>%s</h3>
                        <p>%s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emailRequest.getSubject(), emailRequest.getBody());
    }

    private String getPasswordResetTemplate(EmailRequest emailRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 50px auto; background-color: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    .header { background-color: #ff6b6b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; }
                    .button { display: inline-block; padding: 15px 30px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Restablecer Contraseña</h1>
                    </div>
                    <div class="content">
                        <h2>%s</h2>
                        <p>%s</p>
                        <p>Si no solicitaste este cambio, ignora este correo.</p>
                        <center><a href="#" class="button">Restablecer Contraseña</a></center>
                        <p><small>Este enlace expirará en 24 horas.</small></p>
                    </div>
                    <div class="footer">
                        <p>Por seguridad, no compartimos tu contraseña por correo.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emailRequest.getSubject(), emailRequest.getBody());
    }

    private String getConfirmationTemplate(EmailRequest emailRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; background-color: #e8f5e9; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { background-color: #4caf50; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; text-align: center; }
                    .checkmark { font-size: 60px; color: #4caf50; }
                    .footer { background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Confirmación</h1>
                    </div>
                    <div class="content">
                        <div class="checkmark">✓</div>
                        <h2>%s</h2>
                        <p>%s</p>
                    </div>
                    <div class="footer">
                        <p>Gracias por tu confianza.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emailRequest.getSubject(), emailRequest.getBody());
    }

    private String getInvoiceTemplate(EmailRequest emailRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
                    .invoice { max-width: 700px; margin: 0 auto; background-color: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .invoice-header { background-color: #2c3e50; color: white; padding: 30px; }
                    .invoice-body { padding: 30px; }
                    .invoice-footer { background-color: #ecf0f1; padding: 20px; text-align: center; color: #7f8c8d; }
                    .table { width: 100%%; border-collapse: collapse; margin: 20px 0; }
                    .table th { background-color: #34495e; color: white; padding: 10px; text-align: left; }
                    .table td { padding: 10px; border-bottom: 1px solid #ecf0f1; }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="invoice-header">
                        <h1>📄 Factura</h1>
                    </div>
                    <div class="invoice-body">
                        <h2>%s</h2>
                        <p>%s</p>
                        <table class="table">
                            <tr>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                            <tr>
                                <td>Servicio</td>
                                <td>1</td>
                                <td>$0.00</td>
                            </tr>
                        </table>
                    </div>
                    <div class="invoice-footer">
                        <p>Gracias por su preferencia</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emailRequest.getSubject(), emailRequest.getBody());
    }

    private String getDefaultTemplate(EmailRequest emailRequest) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>%s</h1>
                    <div>%s</div>
                    <div class="footer">
                        <p>Este es un correo automático. Por favor, no responda a este mensaje.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(emailRequest.getSubject(), emailRequest.getBody());
    }

    private String getFumigationApplicationReceivedTemplate(EmailRequest emailRequest) {
        return MessageFormat.format("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; ; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #43a047 0%, #1e88e5 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 40px 20px; }
                .info-box { background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #43a047; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌿 Solicitud de Fumigación Recibida</h1>
                </div>
                <div class="content">
                    <h2>¡Hemos recibido tu solicitud!</h2>
                    <p>{0}</p>
                    <div class="info-box">
                        <p><strong>Estado actual:</strong> Pendiente de revisión</p>
                        <p><strong>Próximos pasos:</strong> Nuestro equipo revisará tu solicitud y te contactará en las próximas 24-48 horas.</p>
                    </div>
                    <center><a href="#" class="button">Ver Estado de Solicitud</a></center>
                </div>
                <div class="footer">
                    <p>Gracias por confiar en nuestros servicios de fumigación profesional.</p>
                </div>
            </div>
        </body>
        </html>
        """, emailRequest.getBody());
    }

    // Plantilla para cambio de estado de fumigación
    private String getFumigationStatusChangedTemplate(EmailRequest emailRequest) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0f2f5; }
                .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { background-color: #ff9800; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .status-badge { display: inline-block; padding: 10px 20px; background-color: white; color: #ff9800; border-radius: 20px; font-weight: bold; margin-top: 10px; }
                .content { padding: 30px; }
                .timeline { border-left: 3px solid #ff9800; padding-left: 20px; margin: 20px 0; }
                .timeline-item { margin-bottom: 15px; }
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📋 Actualización de Estado</h1>
                    <div class="status-badge">NUEVO ESTADO</div>
                </div>
                <div class="content">
                    <h2>Tu fumigación ha cambiado de estado</h2>
                    <p>%s</p>
                    <div class="timeline">
                        <div class="timeline-item">
                            <strong>Fecha de actualización:</strong> Hoy
                        </div>
                        <div class="timeline-item">
                            <strong>Actualizado por:</strong> Administrador
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <p>Si tienes preguntas, no dudes en contactarnos.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(emailRequest.getBody());
    }

    // Plantilla para actualización de fumigación
    private String getFumigationUpdatedTemplate(EmailRequest emailRequest) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #e3f2fd; }
                .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 3px 15px rgba(0,0,0,0.1); }
                .header { background-color: #2196f3; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 30px; }
                .update-box { background-color: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
                .footer { background-color: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔄 Información Actualizada</h1>
                </div>
                <div class="content">
                    <h2>Se han actualizado los detalles de tu fumigación</h2>
                    <div class="update-box">
                        <p>%s</p>
                    </div>
                    <p>Los cambios ya están reflejados en tu perfil. Puedes revisar todos los detalles iniciando sesión en nuestra plataforma.</p>
                </div>
                <div class="footer">
                    <p>Actualización procesada automáticamente por nuestro sistema.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(emailRequest.getBody());
    }

    // Plantilla para reporte de fumigación creado
    private String getFumigationReportCreatedTemplate(EmailRequest emailRequest) {
        return MessageFormat.format("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { padding: 40px; }
                .report-card { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                .checklist { list-style: none; padding: 0; }
                .checklist li { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
                .checklist li:before { content: "✅ "; color: #4caf50; font-weight: bold; }
                .footer { background-color: #f1f1f1; padding: 25px; text-align: center; color: #666; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Reporte de Fumigación Disponible</h1>
                </div>
                <div class="content">
                    <h2>Tu reporte técnico está listo</h2>
                    <div class="report-card">
                        <h3>Detalles del Reporte:</h3>
                        <p>{0}</p>
                        <ul class="checklist">
                            <li>Inspección completa realizada</li>
                            <li>Productos aplicados documentados</li>
                            <li>Áreas tratadas especificadas</li>
                            <li>Recomendaciones incluidas</li>
                        </ul>
                    </div>
                    <center><a href="#" class="button">Ver Reporte Completo</a></center>
                </div>
                <div class="footer">
                    <p>Este reporte ha sido generado por nuestro equipo técnico certificado.</p>
                </div>
            </div>
        </body>
        </html>
        """, emailRequest.getBody());
    }

    // Plantilla para reporte de limpieza creado
    private String getCleanupReportCreatedTemplate(EmailRequest emailRequest) {
        return MessageFormat.format("""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #e8f5e9; }
                .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
                .sparkle { font-size: 24px; }
                .content { padding: 40px; }
                .success-box { background-color: #c8e6c9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                .details { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { background-color: #f1f1f1; padding: 25px; text-align: center; color: #666; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 30px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="sparkle">✨</div>
                    <h1>Reporte de Limpieza Post-Fumigación</h1>
                </div>
                <div class="content">
                    <h2>Limpieza Completada Exitosamente</h2>
                    <div class="success-box">
                        <h3>🧹 Área Sanitizada y Segura</h3>
                    </div>
                    <div class="details">
                        <p>{0}</p>
                        <p><strong>Proceso completado:</strong></p>
                        <ul>
                            <li>Eliminación de residuos</li>
                            <li>Ventilación de áreas</li>
                            <li>Verificación de seguridad</li>
                            <li>Inspección final</li>
                        </ul>
                    </div>
                    <center><a href="#" class="button">Ver Reporte de Limpieza</a></center>
                </div>
                <div class="footer">
                    <p>Tu espacio está listo para ser utilizado de manera segura.</p>
                </div>
            </div>
        </body>
        </html>
        """, emailRequest.getBody());
    }

}