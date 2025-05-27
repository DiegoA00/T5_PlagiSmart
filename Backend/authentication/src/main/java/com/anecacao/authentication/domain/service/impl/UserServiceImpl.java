package com.anecacao.authentication.domain.service.impl;

import com.anecacao.authentication.data.dto.UserRegistrationRequestDTO;
import com.anecacao.authentication.data.dto.UserRegistrationResponseDTO;
import com.anecacao.authentication.data.entity.User;
import com.anecacao.authentication.data.mapper.UserMapper;
import com.anecacao.authentication.data.repository.UserRepository;
import com.anecacao.authentication.domain.exception.UserAlreadyExistsException;
import com.anecacao.authentication.domain.service.UserPasswordService;
import com.anecacao.authentication.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserPasswordService userPasswordService;

    @Override
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRequestDTO) {
        boolean credentialsAreAvailable = areUserCredentialsAvailable(userRequestDTO);

        if(!credentialsAreAvailable) throw new UserAlreadyExistsException();

        User newUser = userMapper.userRegistrationRequestDTOToUser(userRequestDTO);
        userRepository.save(newUser);

        userPasswordService.savePassword(newUser, userRequestDTO.getPassword());

        return userMapper.userToUserRegistrationResponseDTO(newUser);
    }

    private boolean areUserCredentialsAvailable(UserRegistrationRequestDTO userRequestDTO){
        boolean nationalIdIsAvailable = !userRepository.existsUserByNationalId(userRequestDTO.getNationalId());
        boolean emailIsAvailable = !userRepository.existsUserByEmail(userRequestDTO.getEmail());

        return nationalIdIsAvailable && emailIsAvailable;
    }


}
