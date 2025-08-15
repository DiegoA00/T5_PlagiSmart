import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface SidebarOption {
  label: string;
  path: string;
}

const adminOptions: SidebarOption[] = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Solicitudes", path: "/admin/solicitudes" },
  { label: "Lotes de fumigación", path: "/admin/lotes" },
  { label: "Servicios completados", path: "/admin/servicios" },
  { label: "Usuarios", path: "/admin/usuarios" },
];

const technicianOptions: SidebarOption[] = [
  { label: "Lotes Asignados", path: "/tecnico/lotes" },
];

const clientOptions: SidebarOption[] = [
  { label: "Inicio", path: "/client" },
  { label: "Solicitudes Pendientes", path: "/client/solicitudes-pendientes" },
  { label: "Solicitudes en Curso", path: "/client/solicitudes-en-curso" },
  { label: "Solicitudes Finalizadas", path: "/client/solicitudes-finalizadas" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const getMenuOptions = () => {
    if (hasRole(['ROLE_TECHNICIAN'])) {
      return technicianOptions;
    } else if (hasRole(['ROLE_ADMIN'])) {
      return adminOptions;
    } else if (hasRole(['ROLE_CLIENT'])) {
      return clientOptions;
    }
    return [];
  };

  const menuOptions = getMenuOptions();

  return (
    <aside className="w-64 bg-[#003595] text-white p-6 flex flex-col">
      <nav className="flex flex-col gap-4">
        {menuOptions.map((opt) => (
          <Button
            key={opt.path}
            variant={
              location.pathname === opt.path
                ? "secondary"
                : "ghost"
            }
            className={`justify-start ${
              location.pathname === opt.path
                ? "text-[#003595] bg-white font-semibold"
                : "text-white hover:bg-[#002060]"
            }`}
            onClick={() => navigate(opt.path)}
          >
            {opt.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}