import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/layouts/Sidebar";
import { Overlay } from "@/layouts/Overlay";
import { TopBar } from "@/layouts/TopBar";
import { UsersTable, User } from "./Components/UsersTable";
import { RoleChangeModal } from "./Components/RoleChangeModal";
import { usersService } from "@/services/usersService";
import { ApiUser } from "@/types/request";
import { Layout } from "@/layouts/Layout";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
    ...apiUser,
    roles: apiUser.role,
    companies: []
  });

  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await usersService.getAllUsers();
      // Extraer content de la respuesta paginada
      const apiUsers = response.content || [];
      const mappedUsers = apiUsers.map(mapApiUserToUser);
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
      
      console.log(`📊 Total de usuarios cargados: ${mappedUsers.length} de ${response.totalElements}`);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      console.error("Error fetching users:", err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersByRole = async (role: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await usersService.getUsersByRole(role);
      // Extraer content de la respuesta paginada
      const apiUsers = response.content || [];
      const mappedUsers = apiUsers.map(mapApiUserToUser);
      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      console.error("Error fetching users by role:", err);
      setUsers([]);
      setFilteredUsers([]);
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
      console.error("Error changing role:", err);
      throw err;
    }
  };

  return (
    <Layout>
      <main className="flex-1 p-10 bg-white overflow-y-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Gestión de Usuarios</h2>
              <p className="text-gray-500">
                Administra los usuarios y sus roles en el sistema
              </p>
            </div>
          </header>

          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Buscar por nombre, email o rol"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003595] focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === "all" ? "Todos los roles" : role}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <span className="animate-spin mr-2">⌛</span> Cargando usuarios...
            </div>
          ) : (
            <>
              <UsersTable 
                data={filteredUsers} 
                onChangeRole={setSelectedUser} 
              />
              
              {filteredUsers.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron usuarios con los criterios de búsqueda.
                </div>
              )}
            </>
          )}

          <Overlay
            open={!!selectedUser}
            onClose={() => setSelectedUser(null)}
          >
            <RoleChangeModal
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onConfirm={handleChangeRole}
            />
          </Overlay>
        </main>
        </Layout>
  );
}