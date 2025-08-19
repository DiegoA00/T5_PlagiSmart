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
import { Bell, User, Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  userImage?: string;
}

export const TopBar: FC<TopBarProps> = ({ userImage = "/avatar.png" }) => {
  const navigate = useNavigate();
  const { hasRole, logout, user } = useAuth();
  const { toggleSidebar } = useSidebar();
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
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error durante logout:', error);
      window.location.href = '/login';
    }
  };

  const handleProfileClick = () => {
    if (hasRole(['ROLE_ADMIN'])) {
      navigate('/admin/profile');
    } else if (hasRole(['ROLE_CLIENT'])) {
      navigate('/client/profile');
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="h-16 border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <h1 className="text-xl font-bold text-[#003595] hidden lg:block">
          PLAGISMART
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              {displayName && (
                <span className="text-sm text-gray-700">{displayName}</span>
              )}
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg">
            <div className="px-2 py-1.5 text-sm font-medium text-gray-900 border-b">
              {displayName}
            </div>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleProfileClick}
            >
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};