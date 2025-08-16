package com.anecacao.api.email.domain.service.impl;

import com.anecacao.api.email.data.dto.*;
import com.anecacao.api.email.domain.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    @Value("${MAIL_USERNAME}")
    private String EMAIL_FROM;

    @Override
    public void sendApplicationReceivedEmail(EmailRequestData data) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(data.getRecipientEmail());
            helper.setFrom(EMAIL_FROM);
            helper.setSubject("Solicitud de Fumigación #" + data.getRequestId() + " - Confirmación de Recepción");

            helper.setText(buildApplicationReceivedTemplate(data), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendStatusUpdateEmail(StatusUpdateEmailData data) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(data.getRecipientEmail());
            helper.setFrom(EMAIL_FROM);
            helper.setSubject("Actualización de Estado - Fumigación Lote #" + data.getLotNumber());
            helper.setText(buildStatusUpdateTemplate(data), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendAdminNotificationEmail(AdminNotificationEmailData data) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(data.getRecipientEmail());
            helper.setFrom(EMAIL_FROM);
            helper.setSubject("Nueva Solicitud Pendiente - Acción Requerida");

            String htmlContent = buildAdminNotificationTemplate(data);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendInfoUpdateEmail(InfoUpdateEmailData data) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(data.getRecipientEmail());
            helper.setFrom(EMAIL_FROM);
            helper.setSubject("Información Actualizada - Fumigación Lote #" + data.getLotNumber());

            String htmlContent = buildInfoUpdateTemplate(data);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendProcessCompletedEmail(ProcessCompletedEmailData data) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(data.getRecipientEmail());
            helper.setFrom(EMAIL_FROM);
            helper.setSubject("Proceso Finalizado - Fumigación Lote #" + data.getLotNumber());

            String htmlContent = buildProcessCompletedTemplate(data);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }

    private String buildStatusUpdateTemplate(StatusUpdateEmailData data) {
        return """
            <html>
            <body>
                <p>Estimado/a <b>%s</b>,</p>
                <p>Le informamos que el estado de su fumigación ha sido actualizado.</p>
                <p><b>Información de la Actualización:</b></p>
                <ul>
                    <li><b>Lote:</b> #%d</li>
                    <li><b>Estado Anterior:</b> %s</li>
                    <li><b>Nuevo Estado:</b> %s</li>
                    <li><b>Fecha de Actualización:</b> %s</li>
                </ul>
                <p>%s</p>
                <p>Para ver más detalles, puede acceder a nuestro portal en línea.</p>
                <p>Saludos cordiales,<br/>Equipo de Operaciones - ANECACAO</p>
            </body>
            </html>
            """.formatted(
                data.getClientName(),
                data.getLotNumber(),
                data.getPreviousStatus(),
                data.getCurrentStatus(),
                data.getUpdateDate(),
                buildCustomMessage(data)
        );
    }

    private String buildApplicationReceivedTemplate(EmailRequestData data) {
        return """
                <html>
                <body>
                    <p>Estimado/a <b>%s</b>,</p>
                    <p>Hemos recibido exitosamente su solicitud de fumigación para <b>%s</b>.</p>
                    <p><b>Detalles de la Solicitud:</b></p>
                    <ul>
                        <li><b>Número de Solicitud:</b> #%d</li>
                        <li><b>Empresa:</b> %s</li>
                        <li><b>RUC:</b> %s</li>
                        <li><b>Fecha de Solicitud:</b> %s</li>
                        <li><b>Estado Actual:</b> PENDIENTE DE REVISIÓN</li>
                        <li><b>Cantidad de Lotes:</b> %d lotes</li>
                        <li><b>Toneladas Totales:</b> %.2f toneladas</li>
                    </ul>
                    <p><b>Próximos pasos:</b></p>
                    <ol>
                        <li>Nuestro equipo revisará su solicitud en las próximas 24-48 horas</li>
                        <li>Le contactaremos para confirmar fechas y detalles específicos</li>
                        <li>Recibirá una notificación cuando su solicitud sea procesada</li>
                    </ol>
                    <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
                    <p>Atentamente,<br/>Equipo de Fumigación - ANECACAO<br/>Asociación Nacional de Exportadores de Cacao</p>
                </body>
                </html>
                """.formatted(
                data.getClientName(),
                data.getCompanyName(),
                data.getRequestId(),
                data.getCompanyName(),
                data.getCompanyRuc(),
                data.getRequestDate(),
                data.getLotCount(),
                data.getTotalTons()
        );
    }

    private String buildCustomMessage(StatusUpdateEmailData data) {
        return switch (data.getCurrentStatus().toUpperCase()) {
            case "APROBADO" -> "Su solicitud ha sido aprobada. Nos pondremos en contacto para coordinar los detalles del servicio.";
            case "RECHAZADO" -> "Lamentablemente su solicitud no puede ser procesada. Razón: "
                    + (data.getReason() != null ? data.getReason() : "No especificada")
                    + ". Por favor contáctenos para más información.";
            case "FUMIGADO" -> "El proceso de fumigación ha sido completado exitosamente.";
            case "FINALIZADO" -> "Todo el proceso ha sido completado. Su mercancía está lista.";
            default -> "El estado de su solicitud ha cambiado.";
        };
    }

    private String buildAdminNotificationTemplate(AdminNotificationEmailData data) {
        String lotDetailsHtml = data.getLotDetails().stream()
                .map(lot -> "• Lote #" + lot.getLotNumber()
                        + " - " + lot.getTons() + " Toneladas"
                        + " - " + lot.getSacks() + " Sacos"
                        + " - Puerto: " + lot.getPort())
                .reduce("", (acc, line) -> acc + "<br/>" + line);

        return """
            <html>
            <body>
                <p>Estimado Administrador,</p>
                <p>Se ha recibido una nueva solicitud de fumigación que requiere su atención.</p>
                <p><b>Información de la Solicitud:</b></p>
                <ul>
                    <li><b>ID:</b> #%d</li>
                    <li><b>Empresa:</b> %s</li>
                    <li><b>RUC:</b> %s</li>
                    <li><b>Representante Legal:</b> %s</li>
                    <li><b>Contacto:</b> %s / %s</li>
                    <li><b>Cantidad de Lotes:</b> %d</li>
                    <li><b>Toneladas Totales:</b> %.2f</li>
                    <li><b>Prioridad:</b> %s</li>
                </ul>
                <p><b>Detalle de Lotes:</b></p>
                <p>%s</p>
                <p><b>Acciones Requeridas:</b></p>
                <ul>
                    <li>☐ Revisar documentación adjunta</li>
                    <li>☐ Verificar disponibilidad de recursos</li>
                    <li>☐ Aprobar o rechazar la solicitud</li>
                    <li>☐ Asignar técnico responsable</li>
                </ul>
                <p>Por favor, procese esta solicitud lo antes posible.</p>
                <p>Sistema de Gestión - ANECACAO</p>
            </body>
            </html>
            """.formatted(
                data.getRequestId(),
                data.getCompanyName(),
                data.getCompanyRuc(),
                data.getLegalRepresentative(),
                data.getContactEmail(),
                data.getContactPhone(),
                data.getLotCount(),
                data.getTotalTons(),
                data.getPriority(),
                lotDetailsHtml
        );
    }

    private String buildInfoUpdateTemplate(InfoUpdateEmailData data) {
        return """
            <html>
            <body>
                <p>Estimado/a <b>%s</b>,</p>
                <p>Le informamos que se han actualizado los detalles de su fumigación.</p>
                <p><b>Cambios Realizados:</b></p>
                <ul>
                    <li><b>Toneladas:</b> %.2f → %.2f</li>
                    <li><b>Puerto de Destino:</b> %s → %s</li>
                    <li><b>Fecha Programada:</b> %s → %s</li>
                    <li><b>Cantidad de Sacos:</b> %d → %d</li>
                </ul>
                <p>Estos cambios ya están reflejados en nuestro sistema. Si tiene alguna pregunta sobre estas modificaciones, no dude en contactarnos.</p>
                <p>Atentamente,<br/>Departamento de Operaciones - ANECACAO</p>
            </body>
            </html>
            """.formatted(
                data.getClientName(),
                data.getPreviousTons(), data.getNewTons(),
                data.getPreviousPort(), data.getNewPort(),
                data.getPreviousDate(), data.getNewDate(),
                data.getPreviousSacks(), data.getNewSacks()
        );
    }

    private String buildProcessCompletedTemplate(ProcessCompletedEmailData data) {
        return """
        <html>
        <body>
            <p>Estimado/a <b>%s</b>,</p>
            <p>Nos complace informarle que el proceso de fumigación ha sido completado exitosamente.</p>
            <p><b>Resumen del Servicio:</b></p>
            <ul>
                <li><b>Lote Procesado:</b> #%s</li>
                <li><b>Estado Final:</b> COMPLETADO</li>
                <li><b>Toneladas Procesadas:</b> %.2f</li>
            </ul>
            <p><b>Documentación Disponible:</b></p>
            <ul>
                <li>Certificado de Fumigación</li>
                <li>Reporte Técnico Detallado</li>
                <li>Registro de Productos Aplicados</li>
                <li>Recomendaciones Post-Fumigación</li>
            </ul>
            <p>Todos los documentos están disponibles en nuestro portal o pueden ser solicitados directamente.</p>
            <p>Agradecemos su confianza en nuestros servicios.</p>
            <p>Cordialmente,<br/>ANECACAO - Asociación Nacional de Exportadores de Cacao<br/>
            <i>"Comprometidos con la calidad y la excelencia"</i></p>
        </body>
        </html>
        """.formatted(
                data.getClientName(),
                data.getLotNumber(),
                data.getProcessedTons()
        );
    }
}
