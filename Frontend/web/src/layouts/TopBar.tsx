import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "../services/auth/loginService";
import { useAuth } from "@/context/AuthContext";

interface TopBarProps {
  userImage?: string;
}

export const TopBar: FC<TopBarProps> = ({ userImage = "/avatar.png" }) => {
  const navigate = useNavigate();
  const { hasRole, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const userData = authService.getUserData();
    if (userData?.firstName && userData?.lastName) {
      setDisplayName(`${userData.firstName} ${userData.lastName}`);
    } else if (userData?.email) {
      setDisplayName(userData.email);
    } else {
      setDisplayName("");
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Primero limpiar el estado de autenticación
      logout();
      
      // Forzar navegación inmediata
      window.location.href = '/login';
    } catch (error) {
      console.error('Error durante logout:', error);
      // Aún así intentar navegar a login
      window.location.href = '/login';
    }
  };

  const handleProfileClick = () => {
    if (hasRole(['ROLE_ADMIN'])) {
      navigate('/admin/profile');
    } else if (hasRole(['ROLE_CLIENT'])) {
      navigate('/client/profile');
    } else {
      // Fallback en caso de que no tenga rol definido
      navigate('/profile');
    }
  };

  return (
    <div className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold">PLAGISMART</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            {displayName && (
              <span className="text-sm text-gray-700">{displayName}</span>
            )}
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={userImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm font-medium text-gray-900 border-b">
            {displayName}
          </div>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={handleProfileClick}
          >
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer text-red-600"
            onClick={handleLogout}
          >
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};