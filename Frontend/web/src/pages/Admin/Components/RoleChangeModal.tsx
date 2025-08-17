import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "./UsersTable";

interface RoleChangeModalProps {
  user: User | null;
  onClose: () => void;
  onConfirm: (email: string, newRole: string) => Promise<void>;
}

export const RoleChangeModal: FC<RoleChangeModalProps> = ({ user, onClose, onConfirm }) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roleOptions = [
    { value: "ROLE_CLIENT", label: "Cliente" },
    { value: "ROLE_TECHNICIAN", label: "Técnico" },
    { value: "ROLE_ADMIN", label: "Administrador" }
  ];

  const getCurrentRoleLabel = (role: string): string => {
    const roleMap: Record<string, string> = {
      "client": "Cliente",
      "technician": "Técnico", 
      "admin": "Administrador"
    };
    return roleMap[role] || role;
  };

  const handleConfirm = async () => {
    if (!user || !selectedRole) return;

    setIsLoading(true);
    setError("");

    try {
      await onConfirm(user.email, selectedRole);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al cambiar el rol");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="bg-[#003595] text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Cambiar Rol de Usuario</h3>
      </div>
      
      <div className="bg-white p-6 rounded-b-lg">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Usuario:</p>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Rol actual:</p>
            <p className="font-medium">{getCurrentRoleLabel(user.roles)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo rol:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003595] focus:border-transparent"
            >
              <option value="">Seleccionar rol...</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#003595] text-white hover:bg-[#002060] px-4 py-2"
              onClick={handleConfirm}
              disabled={isLoading || !selectedRole}
            >
              {isLoading ? "Cambiando..." : "Confirmar Cambio"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};