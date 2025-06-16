import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp, Folder } from "lucide-react"; // usa lucide o heroicons

const menuData = [
  {
    label: "Gestión de servicios",
    items: [
      { label: "Inicio", path: "/admin/inicio" },
      { label: "Solicitudes en espera", path: "/admin/solicitudes-espera" },
      { label: "Solicitudes reservadas", path: "/admin/solicitudes-reservadas" },
      { label: "Solicitudes Finalizadas", path: "/admin/solicitudes-finalizadas" },
    ],
  },
  {
    label: "Agenda",
    items: [
      { label: "Fumigación", path: "/admin/fumigacion" },
    ],
  },
];

function NavbarClient() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="w-64 bg-[#003595] text-white p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-10">PLAGISMART</h1>
      <nav className="flex flex-col gap-4">
        {menuData.map((section) => (
          <div key={section.label}>
            <button
              onClick={() => toggleSection(section.label)}
              className="flex items-center justify-between w-full text-left font-medium"
            >
              <div className="flex items-center gap-2">
                <Folder size={16} />
                <span>{section.label}</span>
              </div>
              {openSections[section.label] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections[section.label] && (
              <div className="mt-2 ml-6 flex flex-col gap-2">
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`rounded-md text-left px-3 py-2 text-sm font-medium ${location.pathname === item.path
                      ? "bg-white text-[#003595] font-semibold"
                      : "hover:bg-[#002060] text-white"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default NavbarClient