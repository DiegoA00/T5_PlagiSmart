package com.anecacao.api.request.creation.domain.service;

import com.anecacao.api.common.data.dto.MessageDTO;
import com.anecacao.api.request.creation.data.dto.FumigationApplicationDTO;

public interface FumigationApplicationService {
    MessageDTO createFumigationApplication(FumigationApplicationDTO dto, String jwt);
}