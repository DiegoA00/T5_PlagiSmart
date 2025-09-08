import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const roleRoutes = {
  "ROLE_ADMIN": "/admin/solicitudes",
  "ROLE_TECHNICIAN": "/tecnico/lotes",
  "ROLE_CLIENT": "/home",
};

const rolePriority = ["ROLE_ADMIN", "ROLE_TECHNICIAN", "ROLE_CLIENT"];

export const useRoleRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const redirect = () => {
    if (!user || !Array.isArray(user.roles)) {
      navigate("/login");
      return;
    }

    const userRoles = user.roles.map(role => role.name);
    
    for (const role of rolePriority) {
      if (userRoles.includes(role) && roleRoutes[role]) {
        navigate(roleRoutes[role]);
        return;
      }
    }

    navigate("/login");
  };

  return redirect;
};