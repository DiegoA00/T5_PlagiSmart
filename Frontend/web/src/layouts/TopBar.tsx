import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  userImage?: string;
  userName?: string;
}

export const TopBar: FC<TopBarProps> = ({ userImage = "/avatar.png", userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de cerrar sesión
    // Por ejemplo, limpiar el localStorage y redirigir al login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold">PLAGISMART</h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            {userName && (
              <span className="text-sm text-gray-700">{userName}</span>
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
            {userName}
          </div>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/profile')}
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