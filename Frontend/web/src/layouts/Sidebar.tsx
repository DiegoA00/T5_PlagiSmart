import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const adminOptions = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Solicitudes", path: "/admin/solicitudes" },
  { label: "Lotes a fumigar", path: "/admin/lotes" },
  { label: "Servicios finalizados", path: "/admin/servicios" },
  { label: "Usuarios", path: "/admin/usuarios" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#003595] text-white p-6 flex flex-col">
      <nav className="flex flex-col gap-4">
        {adminOptions.map((opt) => (
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