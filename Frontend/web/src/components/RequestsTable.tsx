import { FC } from "react";
import { Request } from "@/types/request";

export const RequestsTable: FC<{ data: Request[]; onViewMore: (request: Request) => void }> = ({ data, onViewMore }) => (
  <div className="overflow-auto rounded-lg border">
    <table className="min-w-full bg-white text-sm" role="table">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Servicio</th>
          <th className="px-4 py-3">Cliente</th>
          <th className="px-4 py-3">Fecha</th>
          <th className="px-4 py-3">Toneladas</th>
          <th className="px-4 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-2">{r.id}</td>
            <td className="px-4 py-2 text-blue-600 cursor-pointer">{r.service}</td>
            <td className="px-4 py-2">{r.client}</td>
            <td className="px-4 py-2">{r.date}</td>
            <td className="px-4 py-2">{r.tons}</td>
            <td
              className="px-4 py-2 text-blue-600 cursor-pointer font-semibold"
              onClick={() => onViewMore(r)}
            >
            Ver Más Información
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);