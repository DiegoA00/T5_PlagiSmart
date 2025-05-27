package com.anecacao.authentication.data.mapper;

import com.anecacao.authentication.data.dto.UserRegistrationRequestDTO;
import com.anecacao.authentication.data.dto.UserRegistrationResponseDTO;
import com.anecacao.authentication.data.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

     UserRegistrationResponseDTO userToUserRegistrationResponseDTO(User user);

     User userRegistrationRequestDTOToUser(UserRegistrationRequestDTO user);

}
