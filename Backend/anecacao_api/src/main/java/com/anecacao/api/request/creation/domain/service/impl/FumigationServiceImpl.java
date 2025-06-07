package com.anecacao.api.request.creation.domain.service.impl;

import com.anecacao.api.request.creation.data.dto.FumigationDTO;
import com.anecacao.api.request.creation.data.entity.Fumigation;
import com.anecacao.api.auth.domain.service.UserService;
import com.anecacao.api.request.creation.data.repository.FumigationRepository;
import com.anecacao.api.request.creation.data.entity.FumigationApplication;
import com.anecacao.api.request.creation.domain.exception.FumigationNotFoundException;
import com.anecacao.api.auth.domain.exception.UnauthorizedAccessException;
import com.anecacao.api.request.creation.domain.service.FumigationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FumigationServiceImpl implements FumigationService {

    private final FumigationRepository fumigationRepository;
    private final UserService userService;

    @Override
    public FumigationDTO  updateFumigation(Long fumigationId, FumigationDTO fumigationDTO, String token) {

        Fumigation fumigation = fumigationRepository.findById(fumigationId)
                .orElseThrow(() -> new FumigationNotFoundException(fumigationId));

        validateUserPermission(fumigation, token);

        updateFumigationData(fumigation, fumigationDTO);

        fumigation = fumigationRepository.save(fumigation);


        return new FumigationDTO(
                fumigation.getId(),
                fumigation.getTon(),
                fumigation.getPortDestination(),
                fumigation.getSacks(),
                fumigation.getGrade(),
                fumigation.getDateTime()
        );
    }

    public void validateUserPermission(Fumigation fumigation, String token) {
        String userIdFromToken = userService.getUserReferenceById(token).getId().toString();

        FumigationApplication fumigationApplication = fumigation.getFumigationApplication();

        Long companyOwnerId = fumigationApplication.getCompany().getLegalRepresentative().getId();

        boolean isAuthorized = userIdFromToken.equals(companyOwnerId.toString()) || userService.hasRole(userIdFromToken, "ROLE_ADMIN");

        if (!isAuthorized) {
            throw new UnauthorizedAccessException("Fumigation", fumigation.getId(), Long.parseLong(userIdFromToken));
        }
    }

    private void updateFumigationData(Fumigation fumigation, FumigationDTO fumigationDTO) {
        fumigation.setTon(fumigationDTO.getTon());
        fumigation.setPortDestination(fumigationDTO.getPortDestination());
        fumigation.setSacks(fumigationDTO.getSacks());
        fumigation.setGrade(fumigationDTO.getGrade());
        fumigation.setDateTime(fumigationDTO.getDateTime());
    }

    @Override
    public Fumigation getFumigationById(Long fumigationId) {
        return fumigationRepository.findById(fumigationId)
                .orElseThrow(() -> new FumigationNotFoundException(fumigationId));
    }

}
