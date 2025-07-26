import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "./UsersTable";

interface RoleChangeModalProps {
  user: User | null;
  onClose: () => void;
  onConfirm: (email: string) => Promise<void>;
}

export const RoleChangeModal: FC<RoleChangeModalProps> = ({ user, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      if (!user || !user.email) {
        throw new Error("Email de usuario no disponible");
      }
      await onConfirm(user.email);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al cambiar el rol");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#003595] text-white px-6 py-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">Cambiar Rol de Usuario</h3>
      </div>
      
      <div className="bg-white p-6 rounded-b-lg">
        <p className="mb-4">
          ¿Estás seguro que deseas cambiar el rol del usuario <strong>{user.firstName} {user.lastName}</strong> a técnico?
        </p>
        
        <div className="text-sm mb-4">
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Roles actuales:</strong> {user.roles.map(role => role.name).join(", ")}</div>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
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
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Confirmar cambio"}
          </Button>
        </div>
      </div>
    </>
  );
};