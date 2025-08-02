import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { UsersTable, User } from "./Components/UsersTable";
import { RoleChangeModal } from "./Components/RoleChangeModal";
import { usersService } from "@/services/usersService";
import { ApiUser } from "@/types/request";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  const roles = ["all", "admin", "client", "technician"];

  useEffect(() => {
    if (selectedRole === "all") {
      fetchAllUsers();
    } else {
      fetchUsersByRole(selectedRole);
    }
  }, [selectedRole]);

  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.roles.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [search, users]);

  const mapApiUserToUser = (apiUser: ApiUser): User => ({
    id: apiUser.id,
    nationalId: apiUser.id.toString(),
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    roles: apiUser.role,
    companies: []
  });

  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await usersService.getAllUsers();
      const apiUsers = response.content || [];
      const mappedUsers = apiUsers.map(mapApiUserToUser);
      
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
      setTotalUsers(response.totalElements || 0);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setUsers([]);
      setFilteredUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersByRole = async (role: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await usersService.getUsersByRole(role);
      const apiUsers = response.content || [];
      const mappedUsers = apiUsers.map(mapApiUserToUser);
      
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
      setTotalUsers(response.totalElements || 0);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setUsers([]);
      setFilteredUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (email: string) => {
    try {
      await usersService.changeUserRole(email);
      
      if (selectedRole === "all") {
        fetchAllUsers();
      } else {
        fetchUsersByRole(selectedRole);
      }
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <Layout>
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Usuarios</h2>
          <p className="text-gray-600">
            Gestiona los usuarios del sistema
            {totalUsers > 0 && ` (${totalUsers} total${totalUsers !== 1 ? 'es' : ''})`}
          </p>
        </header>

        <div className="flex gap-4 items-center mb-6">
          <Input
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "all" ? "Todos los roles" : role}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg">Cargando usuarios...</div>
            <div className="text-gray-500 text-sm mt-2">
              {selectedRole === "all" ? "Cargando todos los usuarios" : `Cargando usuarios con rol ${selectedRole}`}
            </div>
          </div>
        ) : users.length === 0 && !error ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {selectedRole === "all" 
                ? "No hay usuarios en el sistema" 
                : `No hay usuarios con rol ${selectedRole}`
              }
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {totalUsers === 0 
                ? "La base de datos parece estar vacía. Esto es normal después de un reinicio."
                : "Prueba cambiar el filtro de rol o buscar con otros términos."
              }
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {filteredUsers.length} de {users.length} usuario{users.length !== 1 ? 's' : ''}
              {filteredUsers.length !== users.length && ` (filtrados por "${search}")`}
            </div>
            
            <UsersTable
              data={filteredUsers}
              onChangeRole={(user) => setSelectedUser(user)}
            />
          </>
        )}

        <Overlay open={!!selectedUser} onClose={() => setSelectedUser(null)}>
          <RoleChangeModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onConfirm={handleChangeRole}
          />
        </Overlay>
      </div>
    </Layout>
  );
}