import { useMemo, useState } from "react";
import clientData from "./data/fumigacionPorCliente.json";

export default function ClientFumigationTable() {
  const [filtro, setFiltro] = useState("");

  const dataFiltrada = useMemo(() => {
    return clientData.filter((c) =>
      c.Exportadora.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [filtro]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Fumigación por Cliente</h2>
      <input
        className="mb-4 p-2 rounded border border-gray-300 w-full"
        placeholder="Buscar exportadora..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <div className="overflow-auto">
        <table className="table-auto w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th>Exportadora</th>
              <th>Sucursal</th>
              <th>Socio</th>
              <th>Ene</th><th>Feb</th><th>Mar</th>
              <th>Abr</th><th>May</th><th>Jun</th>
              <th>Total</th>
              <th>% Participación</th>
            </tr>
          </thead>
          <tbody>
            {dataFiltrada.map((c) => (
              <tr key={c.Exportadora} className="border-b">
                <td>{c.Exportadora}</td>
                <td>{c.Sucursal || "-"}</td>
                <td>{c.Socio}</td>
                <td>{c.Enero}</td>
                <td>{c.Febrero}</td>
                <td>{c.Marzo}</td>
                <td>{c.Abril}</td>
                <td>{c.Mayo}</td>
                <td>{c.Junio}</td>
                <td className="font-bold">{c.Total}</td>
                <td className="text-green-700">{c.Participacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
