package com.anecacao.api.email.domain.service;

import com.anecacao.api.email.data.dto.*;

public interface EmailService {
    void sendApplicationReceivedEmail(EmailRequestData data);

    void sendStatusUpdateEmail(StatusUpdateEmailData data);

    void sendAdminNotificationEmail(AdminNotificationEmailData data);

    void sendInfoUpdateEmail(InfoUpdateEmailData data);

    void sendProcessCompletedEmail(ProcessCompletedEmailData data);
}
