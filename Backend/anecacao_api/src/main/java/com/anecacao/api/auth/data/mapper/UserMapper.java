package com.anecacao.api.auth.data.mapper;

import com.anecacao.api.auth.data.dto.UserDTO;
import com.anecacao.api.auth.data.dto.UserRegistrationRequestDTO;
import com.anecacao.api.auth.data.dto.UserRegistrationResponseDTO;
import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.auth.data.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

     UserRegistrationResponseDTO userToUserRegistrationResponseDTO(User user);

     User userRegistrationRequestDTOToUser(UserRegistrationRequestDTO user);

     UserDTO userToUserDTO(User user);

     UserResponseDTO userToUserResponseDTO(User user);

     List<UserResponseDTO> usersToUserResponseDTOs(List<User> users);
}
