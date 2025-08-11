package com.anecacao.api.email.helper;

import com.anecacao.api.auth.data.entity.RoleName;
import com.anecacao.api.auth.data.entity.User;
import com.anecacao.api.auth.data.repository.UserRepository;
import com.anecacao.api.email.data.dto.EmailRequest;
import com.anecacao.api.email.domain.service.EmailService;
import com.anecacao.api.request.creation.data.entity.Company;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.data.entity.Status;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FumigationEmailHelper {

    private static final Logger logger = LoggerFactory.getLogger(FumigationEmailHelper.class);
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Value("${app.support.email:soporte@anecacao.com}")
    private String supportEmail;

    @Value("${app.noreply.email:noreply@anecacao.com}")
    private String noReplyEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    /**
     * Envía email cuando se crea una nueva aplicación de fumigación
     * - Email al cliente (representante legal)
     * - Email a TODOS los administradores del sistema
     */
    @Async
    public void sendNewApplicationEmail(FumigationApplication application, String clientEmail) {
        try {
            // 1. Email al cliente
            EmailRequest clientEmailRequest = buildNewApplicationClientEmail(application, clientEmail);
            emailService.sendHtmlEmail(clientEmailRequest);
            logger.info("Email de nueva aplicación enviado a cliente: {}", clientEmail);

            // 2. Obtener todos los administradores y enviarles notificación
            List<String> adminEmails = getAllAdminEmails();

            if (adminEmails.isEmpty()) {
                logger.warn("No se encontraron administradores para notificar sobre la nueva aplicación");
            } else {
                // Enviar email a cada administrador
                for (String adminEmail : adminEmails) {
                    try {
                        EmailRequest adminEmailRequest = buildNewApplicationAdminEmail(application, clientEmail, adminEmail);
                        emailService.sendHtmlEmail(adminEmailRequest);
                        logger.info("Notificación de nueva aplicación enviada a admin: {}", adminEmail);
                    } catch (Exception e) {
                        logger.error("Error enviando notificación al admin {}: ", adminEmail, e);
                        // Continuar con los demás admins aunque falle uno
                    }
                }

                // Opcionalmente, también puedes enviar un solo email con todos los admins en CC
                // EmailRequest adminGroupEmail = buildNewApplicationAdminGroupEmail(application, clientEmail, adminEmails);
                // emailService.sendHtmlEmail(adminGroupEmail);
            }

        } catch (Exception e) {
            logger.error("Error enviando emails de nueva aplicación: ", e);
        }
    }

    /**
     * Obtiene los emails de todos los usuarios con rol ADMIN
     */
    private List<String> getAllAdminEmails() {
        try {
            // Obtener todos los admins (sin paginación para obtener todos)
            Pageable pageable = PageRequest.of(0, 1000); // Ajusta el tamaño según tu necesidad
            Page<User> adminUsers = userRepository.findByRoleName(RoleName.ROLE_ADMIN, pageable);

            List<String> emails = adminUsers.getContent().stream()
                    .map(User::getEmail)
                    .filter(email -> email != null && !email.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

            logger.info("Se encontraron {} administradores para notificar", emails.size());
            return emails;

        } catch (Exception e) {
            logger.error("Error obteniendo emails de administradores: ", e);
            return List.of(); // Retornar lista vacía en caso de error
        }
    }

    /**
     * Alternativa: Enviar un solo email con todos los admins en CC o BCC
     */
    @Async
    public void sendNewApplicationEmailWithGroupNotification(FumigationApplication application, String clientEmail) {
        try {
            // 1. Email al cliente
            EmailRequest clientEmailRequest = buildNewApplicationClientEmail(application, clientEmail);
            emailService.sendHtmlEmail(clientEmailRequest);
            logger.info("Email de nueva aplicación enviado a cliente: {}", clientEmail);

            // 2. Obtener todos los administradores
            List<String> adminEmails = getAllAdminEmails();

            if (!adminEmails.isEmpty()) {
                // Crear un solo email con todos los admins en BCC para privacidad
                EmailRequest adminGroupEmail = buildNewApplicationAdminGroupEmail(application, clientEmail, adminEmails);
                emailService.sendHtmlEmail(adminGroupEmail);
                logger.info("Notificación grupal enviada a {} administradores", adminEmails.size());
            }

        } catch (Exception e) {
            logger.error("Error enviando emails de nueva aplicación: ", e);
        }
    }

    /**
     * Envía email cuando cambia el estado de una fumigación
     */
    @Async
    public void sendStatusChangeEmail(Fumigation fumigation, Status oldStatus, Status newStatus) {
        try {
            Company company = fumigation.getFumigationApplication().getCompany();
            String clientEmail = company.getLegalRepresentative().getEmail();

            EmailRequest emailRequest = buildStatusChangeEmail(fumigation, oldStatus, newStatus, clientEmail);
            emailService.sendHtmlEmail(emailRequest);
            logger.info("Email de cambio de estado enviado a: {}", clientEmail);

            // Notificar a admins en estados importantes: PENDING (nueva solicitud), REJECTED, FINISHED, FAILED
            if (newStatus == Status.PENDING || newStatus == Status.REJECTED || newStatus == Status.FINISHED || newStatus == Status.FAILED) {
                notifyAdminsAboutCriticalStatusChange(fumigation, oldStatus, newStatus);
            }

        } catch (Exception e) {
            logger.error("Error enviando email de cambio de estado: ", e);
        }
    }

    /**
     * Notifica a todos los administradores sobre cambios de estado importantes
     */
    @Async
    private void notifyAdminsAboutCriticalStatusChange(Fumigation fumigation, Status oldStatus, Status newStatus) {
        try {
            List<String> adminEmails = getAllAdminEmails();
            Company company = fumigation.getFumigationApplication().getCompany();

            // Determinar el nivel de prioridad según el estado
            String priority = "";
            String priorityColor = "";

            switch (newStatus) {
                case PENDING:
                    priority = "NUEVA";
                    priorityColor = "#FF9800";
                    break;
                case REJECTED:
                case FAILED:
                    priority = "ALTA";
                    priorityColor = "#F44336";
                    break;
                case FINISHED:
                    priority = "NORMAL";
                    priorityColor = "#00BCD4";
                    break;
                default:
                    priority = "NORMAL";
                    priorityColor = "#9E9E9E";
            }

            for (String adminEmail : adminEmails) {
                try {
                    EmailRequest adminNotification = new EmailRequest();
                    adminNotification.setTo(adminEmail);

                    // Asunto específico según el estado
                    String subject = "";
                    if (newStatus == Status.PENDING) {
                        subject = String.format("🆕 Nueva Solicitud Pendiente - Fumigación Lote #%s", fumigation.getLotNumber());
                    } else {
                        subject = String.format("%s Estado Actualizado - Fumigación Lote #%s - %s",
                                getStatusEmoji(newStatus), fumigation.getLotNumber(), newStatus);
                    }
                    adminNotification.setSubject(subject);

                    String body = String.format("""
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
                                .alert-box { background-color: %s; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                                .content { background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                                .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
                                .label { font-weight: bold; color: #555; }
                                .status-old { color: #999; }
                                .status-new { color: %s; font-weight: bold; font-size: 16px; }
                                .action-box { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid %s; }
                            </style>
                        </head>
                        <body>
                            <div class="alert-box">
                                <h2>%s Notificación de Estado - Prioridad: %s</h2>
                            </div>
                            
                            <div class="content">
                                <h3>%s</h3>
                                
                                <div class="detail-row">
                                    <span class="label">Lote:</span> #%s
                                </div>
                                <div class="detail-row">
                                    <span class="label">Empresa:</span> %s (RUC: %s)
                                </div>
                                <div class="detail-row">
                                    <span class="label">Representante:</span> %s %s
                                </div>
                                <div class="detail-row">
                                    <span class="label">Teléfono:</span> %s
                                </div>
                                <div class="detail-row">
                                    <span class="label">Estado Anterior:</span> <span class="status-old">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">Nuevo Estado:</span> <span class="status-new">%s %s</span>
                                </div>
                                %s
                                <div class="detail-row">
                                    <span class="label">Fecha del Cambio:</span> %s
                                </div>
                                
                                <div class="action-box">
                                    <h4>✅ Acción Requerida:</h4>
                                    %s
                                </div>
                                
                                <center style="margin-top: 20px;">
                                    <a href="%s/admin/fumigations/%s" style="display: inline-block; padding: 12px 30px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 5px;">
                                        Ver Detalles Completos
                                    </a>
                                </center>
                            </div>
                        </body>
                        </html>
                        """,
                            priorityColor,
                            getStatusColor(newStatus),
                            priorityColor,
                            getStatusEmoji(newStatus),
                            priority,
                            newStatus == Status.PENDING ? "Nueva Solicitud Pendiente de Revisión" : "Cambio de Estado en Fumigación",
                            fumigation.getLotNumber(),
                            company.getName(),
                            company.getRuc(),
                            company.getLegalRepresentative().getFirstName(),
                            company.getLegalRepresentative().getLastName(),
                            company.getPhoneNumber() != null ? company.getPhoneNumber() : "No registrado",
                            oldStatus != null ? oldStatus.toString() : "N/A",
                            getStatusEmoji(newStatus),
                            newStatus,
                            (newStatus == Status.REJECTED || newStatus == Status.FAILED) && fumigation.getMessage() != null ?
                                    String.format("<div class='detail-row'><span class='label'>Razón/Mensaje:</span> %s</div>", fumigation.getMessage()) : "",
                            LocalDate.now().format(DATE_FORMATTER),
                            getAdminActionRequired(newStatus),
                            frontendUrl,
                            fumigation.getId()
                    );

                    adminNotification.setBody(body);
                    adminNotification.setHtml(true);
                    emailService.sendHtmlEmail(adminNotification);
                    logger.info("Notificación de estado {} enviada al admin: {}", newStatus, adminEmail);

                } catch (Exception e) {
                    logger.error("Error notificando cambio de estado al admin {}: ", adminEmail, e);
                }
            }
        } catch (Exception e) {
            logger.error("Error notificando cambio de estado a admins: ", e);
        }
    }

    /**
     * Determina la acción requerida por el admin según el estado
     */
    private String getAdminActionRequired(Status status) {
        return switch (status) {
            case PENDING ->
                    "<p style='color: #FF9800;'>• <strong>Revisar nueva solicitud</strong><br>" +
                            "• Verificar documentación y requisitos<br>" +
                            "• Aprobar o rechazar la solicitud<br>" +
                            "• Asignar técnico si se aprueba</p>";

            case APPROVED ->
                    "<p style='color: #4CAF50;'>• Coordinar con el equipo técnico<br>" +
                            "• Confirmar fecha y hora de fumigación<br>" +
                            "• Notificar al cliente sobre el cronograma</p>";

            case REJECTED ->
                    "<p style='color: #F44336;'>• <strong>Revisar la razón del rechazo</strong><br>" +
                            "• Contactar al cliente si es necesario<br>" +
                            "• Verificar si se puede resolver el problema<br>" +
                            "• Documentar el caso</p>";

            case FAILED ->
                    "<p style='color: #F44336;'>• <strong>URGENTE: Investigar la causa del fallo</strong><br>" +
                            "• Coordinar acciones correctivas inmediatas<br>" +
                            "• Notificar al equipo técnico<br>" +
                            "• Contactar al cliente para informar y reprogramar</p>";

            case FINISHED ->
                    "<p style='color: #00BCD4;'>• Verificar que todos los documentos estén completos<br>" +
                            "• Confirmar la satisfacción del cliente<br>" +
                            "• Generar reporte final<br>" +
                            "• Cerrar el caso si todo está correcto</p>";

            case FUMIGATED ->
                    "<p style='color: #2196F3;'>• Verificar el reporte de fumigación<br>" +
                            "• Confirmar que el proceso se completó correctamente<br>" +
                            "• Preparar documentación para el cliente<br>" +
                            "• Coordinar siguiente fase del proceso</p>";

            default -> "<p>No se requiere acción inmediata.</p>";
        };
    }

    /**
     * Envía email cuando se actualiza una fumigación
     */
    @Async
    public void sendFumigationUpdateEmail(Fumigation fumigation, Map<String, String> changes) {
        try {
            Company company = fumigation.getFumigationApplication().getCompany();
            String clientEmail = company.getLegalRepresentative().getEmail();

            EmailRequest emailRequest = buildUpdateEmail(fumigation, changes, clientEmail);
            emailService.sendHtmlEmail(emailRequest);
            logger.info("Email de actualización enviado a: {}", clientEmail);

        } catch (Exception e) {
            logger.error("Error enviando email de actualización: ", e);
        }
    }

    // ================ MÉTODOS PRIVADOS DE CONSTRUCCIÓN DE EMAILS ================

    private EmailRequest buildNewApplicationClientEmail(FumigationApplication application, String clientEmail) {
        EmailRequest request = new EmailRequest();
        request.setTo(clientEmail);
        request.setSubject("Solicitud de Fumigación #" + application.getId() + " - Confirmación de Recepción");

        Company company = application.getCompany();
        String fumigationsList = buildFumigationsList(application);

        String body = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #8B4513 0%%, #D2691E 100%%); color: white; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { margin: 0; font-size: 28px; }
                    .logo { font-size: 48px; margin-bottom: 10px; }
                    .content { padding: 40px 20px; }
                    .info-box { background-color: #FFF8DC; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #8B4513; }
                    .details-table { width: 100%%; margin: 20px 0; }
                    .details-table td { padding: 10px; border-bottom: 1px solid #e0e0e0; }
                    .details-table td:first-child { font-weight: bold; color: #555; width: 40%%; }
                    .button { display: inline-block; padding: 12px 30px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 12px; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🍫</div>
                        <h1>Solicitud de Fumigación Recibida</h1>
                    </div>
                    <div class="content">
                        <h2>Estimado/a %s,</h2>
                        <p>Hemos recibido exitosamente su solicitud de fumigación para <strong>%s</strong>.</p>
                        
                        <div class="info-box">
                            <h3>📋 Detalles de la Solicitud:</h3>
                            <table class="details-table">
                                <tr>
                                    <td>Número de Solicitud:</td>
                                    <td>#%s</td>
                                </tr>
                                <tr>
                                    <td>Empresa:</td>
                                    <td>%s</td>
                                </tr>
                                <tr>
                                    <td>RUC:</td>
                                    <td>%s</td>
                                </tr>
                                <tr>
                                    <td>Fecha de Solicitud:</td>
                                    <td>%s</td>
                                </tr>
                                <tr>
                                    <td>Estado Actual:</td>
                                    <td><span style="color: #ff9800;">PENDIENTE</span></td>
                                </tr>
                            </table>
                        </div>
                        
                        <div class="info-box">
                            <h3>📦 Lotes para Fumigación:</h3>
                            %s
                        </div>
                        
                        <p><strong>Próximos pasos:</strong></p>
                        <ul>
                            <li>Nuestro equipo revisará su solicitud en las próximas 24-48 horas</li>
                            <li>Le contactaremos para confirmar fechas y detalles específicos</li>
                            <li>Recibirá una notificación cuando su solicitud sea aprobada</li>
                        </ul>
                        
                        <center>
                            <a href="%s/applications/%s" class="button">Ver Estado de Solicitud</a>
                        </center>
                    </div>
                    <div class="footer">
                        <p>Anecacao - Asociación Nacional de Exportadores de Cacao</p>
                        <p>Si tiene alguna pregunta, contáctenos a: %s</p>
                    </div>
                </div>
            </body>
            </html>
            """,
                company.getLegalRepresentative().getFirstName() + " " + company.getLegalRepresentative().getLastName(),
                company.getName(),
                application.getId(),
                company.getBusinessName(),
                company.getRuc(),
                application.getCreatedAt().format(DATE_FORMATTER),
                fumigationsList,
                frontendUrl, application.getId(),
                supportEmail
        );

        request.setBody(body);
        request.setHtml(true);
        return request;
    }

    private EmailRequest buildNewApplicationAdminEmail(FumigationApplication application, String clientEmail, String adminEmail) {
        EmailRequest request = new EmailRequest();
        request.setTo(adminEmail);
        request.setSubject("⚡ Nueva Solicitud de Fumigación #" + application.getId());

        Company company = application.getCompany();
        int totalTons = application.getFumigations().stream()
                .mapToInt(f -> Integer.parseInt(String.valueOf(f.getTon())))
                .sum();

        String body = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
                    .alert { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                    .details { background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .highlight { color: #8B4513; font-weight: bold; }
                    table { width: 100%%; border-collapse: collapse; margin: 15px 0; }
                    td { padding: 8px; border-bottom: 1px solid #ddd; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="alert">
                    <h2>⚡ Nueva Solicitud de Fumigación Recibida</h2>
                </div>
                
                <div class="details">
                    <h3>Información de la Solicitud:</h3>
                    <table>
                        <tr>
                            <td><strong>ID Solicitud:</strong></td>
                            <td class="highlight">#%s</td>
                        </tr>
                        <tr>
                            <td><strong>Empresa:</strong></td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td><strong>RUC:</strong></td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td><strong>Representante Legal:</strong></td>
                            <td>%s %s</td>
                        </tr>
                        <tr>
                            <td><strong>Email Cliente:</strong></td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td><strong>Teléfono:</strong></td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td><strong>Dirección:</strong></td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td><strong>Cantidad de Lotes:</strong></td>
                            <td class="highlight">%d lotes</td>
                        </tr>
                        <tr>
                            <td><strong>Toneladas Totales:</strong></td>
                            <td class="highlight">%d toneladas</td>
                        </tr>
                        <tr>
                            <td><strong>Fecha de Solicitud:</strong></td>
                            <td>%s</td>
                        </tr>
                    </table>
                    
                    <h4>Detalle de Lotes:</h4>
                    %s
                    
                    <center>
                        <a href="%s/admin/applications/%s" class="button">Revisar Solicitud</a>
                    </center>
                    
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">
                        Este es un mensaje automático del sistema. Por favor, revise y procese esta solicitud lo antes posible.
                    </p>
                </div>
            </body>
            </html>
            """,
                application.getId(),
                company.getName(),
                company.getRuc(),
                company.getLegalRepresentative().getFirstName(),
                company.getLegalRepresentative().getLastName(),
                clientEmail,
                company.getPhoneNumber(),
                company.getAddress(),
                application.getFumigations().size(),
                totalTons,
                application.getCreatedAt().format(DATE_FORMATTER),
                buildDetailedFumigationsList(application),
                frontendUrl,
                application.getId()
        );

        request.setBody(body);
        request.setHtml(true);
        return request;
    }

    /**
     * Construye un email grupal con todos los admins en BCC
     */
    private EmailRequest buildNewApplicationAdminGroupEmail(FumigationApplication application, String clientEmail, List<String> adminEmails) {
        EmailRequest request = new EmailRequest();

        // Usar el primer admin como TO, o un email genérico
        request.setTo(adminEmails.get(0));

        // Poner el resto en BCC para privacidad
        if (adminEmails.size() > 1) {
            request.setBcc(adminEmails.subList(1, adminEmails.size()));
        }

        request.setSubject("⚡ Nueva Solicitud de Fumigación #" + application.getId());

        // El body sería el mismo que buildNewApplicationAdminEmail
        Company company = application.getCompany();

        String body = String.format("""
            <h3>Nueva Solicitud de Fumigación - Notificación Grupal</h3>
            <p>Esta notificación ha sido enviada a todos los administradores del sistema.</p>
            <hr>
            <p><strong>ID:</strong> #%s</p>
            <p><strong>Empresa:</strong> %s (RUC: %s)</p>
            <p><strong>Representante:</strong> %s %s</p>
            <p><strong>Email:</strong> %s</p>
            <p><strong>Cantidad de Lotes:</strong> %d</p>
            <p><strong>Fecha:</strong> %s</p>
            <p><a href="%s/admin/applications/%s">Ver en el Panel de Administración</a></p>
            """,
                application.getId(),
                company.getName(), company.getRuc(),
                company.getLegalRepresentative().getFirstName(),
                company.getLegalRepresentative().getLastName(),
                clientEmail,
                application.getFumigations().size(),
                application.getCreatedAt().format(DATE_FORMATTER),
                frontendUrl, application.getId()
        );

        request.setBody(body);
        request.setHtml(true);
        return request;
    }

    private EmailRequest buildStatusChangeEmail(Fumigation fumigation, Status oldStatus, Status newStatus, String clientEmail) {
        EmailRequest request = new EmailRequest();
        request.setTo(clientEmail);
        request.setSubject("Actualización de Estado - Fumigación Lote #" + fumigation.getLotNumber());

        String statusColor = getStatusColor(newStatus);
        String statusEmoji = getStatusEmoji(newStatus);
        String statusMessage = getStatusMessage(newStatus, fumigation.getMessage());

        String body = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; }
                    .header { background-color: %s; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { padding: 30px; }
                    .status-badge { display: inline-block; padding: 10px 20px; background-color: %s; color: white; border-radius: 20px; font-weight: bold; margin: 10px 0; }
                    .details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>%s Cambio de Estado</h1>
                    </div>
                    <div class="content">
                        <h2>Fumigación Lote #%s</h2>
                        <p>El estado de su fumigación ha cambiado:</p>
                        
                        <div class="details">
                            <p><strong>Estado Anterior:</strong> %s</p>
                            <p><strong>Nuevo Estado:</strong> <span class="status-badge">%s</span></p>
                            <p><strong>Fecha de Actualización:</strong> %s</p>
                        </div>
                        
                        %s
                        
                        <p><a href="%s/fumigations/%s" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Ver Detalles</a></p>
                    </div>
                </div>
            </body>
            </html>
            """,
                statusColor,
                statusColor,
                statusEmoji,
                fumigation.getLotNumber(),
                oldStatus.toString(),
                newStatus.toString(),
                LocalDate.now().format(DATE_FORMATTER),
                statusMessage,
                frontendUrl, fumigation.getId()
        );

        request.setBody(body);
        request.setHtml(true);
        return request;
    }

    private EmailRequest buildUpdateEmail(Fumigation fumigation, Map<String, String> changes, String clientEmail) {
        EmailRequest request = new EmailRequest();
        request.setTo(clientEmail);
        request.setSubject("Actualización de Información - Fumigación Lote #" + fumigation.getLotNumber());

        StringBuilder changesHtml = new StringBuilder();
        for (Map.Entry<String, String> change : changes.entrySet()) {
            changesHtml.append(String.format("<li><strong>%s:</strong> %s</li>", change.getKey(), change.getValue()));
        }

        String body = String.format("""
            <h2>Información Actualizada</h2>
            <p>Se han actualizado los siguientes datos de la fumigación del Lote #%s:</p>
            <ul>%s</ul>
            <p>Fecha de actualización: %s</p>
            <p><a href="%s/fumigations/%s">Ver Detalles Completos</a></p>
            """,
                fumigation.getLotNumber(),
                changesHtml.toString(),
                LocalDate.now().format(DATE_FORMATTER),
                frontendUrl, fumigation.getId()
        );

        request.setBody(body);
        request.setHtml(true);
        return request;
    }

    // ================ MÉTODOS AUXILIARES ================

    private String buildFumigationsList(FumigationApplication application) {
        StringBuilder list = new StringBuilder("<ul>");
        application.getFumigations().forEach(f -> {
            list.append(String.format("<li>Lote #%s - %s Toneladas - %d Sacos</li>",
                    f.getLotNumber(), f.getTon(), f.getSacks()));
        });
        list.append("</ul>");
        return list.toString();
    }

    private String buildDetailedFumigationsList(FumigationApplication application) {
        StringBuilder list = new StringBuilder("<ul style='list-style-type: none; padding: 0;'>");
        application.getFumigations().forEach(f -> {
            list.append(String.format(
                    "<li style='background-color: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 5px;'>" +
                            "🏷️ <strong>Lote #%s</strong><br>" +
                            "&nbsp;&nbsp;&nbsp;&nbsp;• Toneladas: %s<br>" +
                            "&nbsp;&nbsp;&nbsp;&nbsp;• Sacos: %d<br>" +
                            "&nbsp;&nbsp;&nbsp;&nbsp;• Calidad: %s<br>" +
                            "&nbsp;&nbsp;&nbsp;&nbsp;• Puerto: %s" +
                            "</li>",
                    f.getLotNumber(),
                    f.getTon(),
                    f.getSacks(),
                    f.getQuality() != null ? f.getQuality() : "Por definir",
                    f.getPortDestination() != null ? f.getPortDestination() : "Por definir"
            ));
        });
        list.append("</ul>");
        return list.toString();
    }

    private String getStatusColor(Status status) {
        return switch (status) {
            case APPROVED -> "#4CAF50";
            case FINISHED -> "#00BCD4";
            case REJECTED -> "#F44336";
            case PENDING -> "#FF9800";
            default -> "";
        };
    }

    private String getStatusEmoji(Status status) {
        return switch (status) {
            case APPROVED -> "✅🔄";
            case FINISHED -> "✔️";
            case REJECTED -> "❌";
            case PENDING -> "⏳";
            default -> "📋";
        };
    }

    private String getStatusMessage(Status status, String customMessage) {
        return switch (status) {
            case APPROVED -> "<p style='color: green;'><strong>¡Excelente!</strong> Su solicitud ha sido aprobada. Nos pondremos en contacto pronto para coordinar los detalles.</p>";
            case FINISHED -> "<p style='color: teal;'><strong>¡Completado!</strong> El servicio de fumigación ha sido finalizado exitosamente.</p>";
            case REJECTED -> "<p style='color: red;'><strong>Rechazado:</strong> " + (customMessage != null ? customMessage : "Su solicitud no pudo ser procesada.") + "</p>";
            case PENDING -> "<p style='color: orange;'><strong>Pendiente:</strong> Su solicitud está en espera de revisión.</p>";
            default -> "";
        };
    }
}