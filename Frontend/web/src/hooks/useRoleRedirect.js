import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/loginService";

const roleRoutes = {
  "ROLE_ADMIN": "/admin/solicitudes",
  "ROLE_TECHNICIAN": "/tecnico/lotes",
  "ROLE_CLIENT": "/home",
};

const rolePriority = ["ROLE_ADMIN", "ROLE_TECHNICIAN", "ROLE_CLIENT"];

export const useRoleRedirect = () => {
  const navigate = useNavigate();

  const redirect = () => {
    const userData = authService.getUserData();
    if (!userData || !Array.isArray(userData.roles)) {
      navigate("/login");
      return;
    }

    const userRoles = userData.roles.map(role => role.name);
    
    const redirectPath = rolePriority
      .find(role => userRoles.includes(role) && roleRoutes[role]);

    if (redirectPath) {
      navigate(roleRoutes[redirectPath]);
    } else {
      navigate("/login");
    }
  };

  return redirect;
};