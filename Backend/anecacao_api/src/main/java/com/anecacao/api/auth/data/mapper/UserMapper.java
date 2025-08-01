package com.anecacao.api.auth.data.mapper;

import com.anecacao.api.auth.data.dto.UserDTO;
import com.anecacao.api.auth.data.dto.UserRegistrationRequestDTO;
import com.anecacao.api.auth.data.dto.UserRegistrationResponseDTO;
import com.anecacao.api.auth.data.dto.UserResponseDTO;
import com.anecacao.api.auth.data.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

     UserRegistrationResponseDTO userToUserRegistrationResponseDTO(User user);

     User userRegistrationRequestDTOToUser(UserRegistrationRequestDTO user);

     UserDTO userToUserDTO(User user);

     @Mapping(target = "role", expression = "java(extractFirstRole(user))")
     UserResponseDTO userToUserResponseDTO(User user);

     List<UserResponseDTO> usersToUserResponseDTOs(List<User> users);

     default String extractFirstRole(User user) {
          if (user.getRoles() == null || user.getRoles().isEmpty()) {
               return "unknown";
          }
          return user.getRoles().stream()
                  .map(role -> role.getName().toString().replace("ROLE_", "").toLowerCase())
                  .findFirst()
                  .orElse("unknown");
     }
}
