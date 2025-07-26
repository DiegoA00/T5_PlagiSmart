import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/layouts/Sidebar";
import { Overlay } from "@/layouts/Overlay";
import { TopBar } from "@/layouts/TopBar";
import { UsersTable, User } from "./Components/UsersTable";
import { RoleChangeModal } from "./Components/RoleChangeModal";
import apiClient from "@/services/api/apiService";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (Array.isArray(users) && users.length > 0) {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.roles.some(role => role.name.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [search, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await apiClient.get('/users');
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else if (response.data && Array.isArray(response.data.content)) {
        setUsers(response.data.content);
        setFilteredUsers(response.data.content);
      } else if (response.data && typeof response.data === 'object' && response.data.id) {
        const singleUser = response.data;
        console.log("Converting single user to array:", singleUser);
        setUsers([singleUser]);
        setFilteredUsers([singleUser]);
      } else {
        console.error("Unexpected API response format:", response.data);
        setError("Error: formato de datos inesperado");
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (err: any) {
      setError("Error al cargar usuarios: " + (err.message || "Error desconocido"));
      console.error("Error fetching users:", err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const adminseChangeRole = async (email: string) => {
    try {
      await apiClient.put('/users/role', { email });
      fetchUsers();
    } catch (err: any) {
      console.error("Error changing role:", err);
      throw new Error(err.response?.data?.message || "Error al cambiar el rol");
    }
  };

  function handleChangeRole(email: string): Promise<void> {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-10 bg-white overflow-y-auto">
          <header className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-1">Gestión de Usuarios</h2>
              <p className="text-gray-500">
                Administra los usuarios y sus roles en el sistema
              </p>
            </div>
          </header>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Buscar por nombre, email o rol"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
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
      </div>
    </div>
  );
}