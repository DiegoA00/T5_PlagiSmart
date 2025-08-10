package com.anecacao.api.email.data.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class EmailRequest {

    @NotNull(message = "El destinatario es requerido")
    @Email(message = "El formato del email es inválido")
    @JsonProperty("to")
    private String to;

    @JsonProperty("cc")
    private List<String> cc;

    @JsonProperty("bcc")
    private List<String> bcc;

    @NotBlank(message = "El asunto es requerido")
    @JsonProperty("subject")
    private String subject;

    @NotBlank(message = "El cuerpo del mensaje es requerido")
    @JsonProperty("body")
    private String body;

    @JsonProperty("isHtml")
    private boolean isHtml = false;

    @JsonProperty("attachments")
    private Map<String, String> attachments; // nombre archivo -> ruta o base64

    @JsonProperty("priority")
    private String priority = "NORMAL"; // HIGH, NORMAL, LOW

    // Constructor vacío
    public EmailRequest() {}

    // Constructor con parámetros básicos
    public EmailRequest(String to, String subject, String body) {
        this.to = to;
        this.subject = subject;
        this.body = body;
    }

    // Constructor completo
    public EmailRequest(String to, String subject, String body, boolean isHtml) {
        this.to = to;
        this.subject = subject;
        this.body = body;
        this.isHtml = isHtml;
    }

    // Getters y Setters
    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public List<String> getCc() {
        return cc;
    }

    public void setCc(List<String> cc) {
        this.cc = cc;
    }

    public List<String> getBcc() {
        return bcc;
    }

    public void setBcc(List<String> bcc) {
        this.bcc = bcc;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public boolean isHtml() {
        return isHtml;
    }

    public void setHtml(boolean html) {
        isHtml = html;
    }

    public Map<String, String> getAttachments() {
        return attachments;
    }

    public void setAttachments(Map<String, String> attachments) {
        this.attachments = attachments;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    @Override
    public String toString() {
        return "EmailRequest{" +
                "to='" + to + '\'' +
                ", subject='" + subject + '\'' +
                ", isHtml=" + isHtml +
                ", priority='" + priority + '\'' +
                '}';
    }
}