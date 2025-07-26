import { FC } from "react";

interface Role {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  businessName: string;
  phoneNumber: string;
  ruc: string;
  address: string;
}

export interface User {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  companies: Company[];
}

interface UsersTableProps {
  data: User[];
  onChangeRole: (user: User) => void;
}

export const UsersTable: FC<UsersTableProps> = ({ data, onChangeRole }) => (
  <div className="overflow-auto rounded-lg border border-[#003595]">
    <table className="min-w-full bg-white text-sm" role="table">
      <thead className="bg-[#003595] text-left text-white">
        <tr>
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Nombre</th>
          <th className="px-4 py-3">Apellido</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Roles</th>
          <th className="px-4 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((user) => (
            <tr key={user.id} className="border-t border-[#003595] hover:bg-[#E6ECF7]">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.firstName}</td>
              <td className="px-4 py-2">{user.lastName}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                {user.roles.map(role => role.name).join(", ")}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onChangeRole(user)}
                  className="text-[#003595] font-semibold hover:underline"
                >
                  Cambiar rol
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
              No hay usuarios disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);