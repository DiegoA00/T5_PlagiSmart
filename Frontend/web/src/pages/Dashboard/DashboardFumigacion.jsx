import { useState } from "react";
import data from "./data/fumigacionData.json";
import SummaryCard from "./SummaryCard";
import { Filters } from "./Filters";
import MonthlyChart from "./MonthlyChart";
import ClientFumigationTable from "./ClientFumigationTable";

export default function DashboardFumigacion() {
  const [selectedMonth, setSelectedMonth] = useState("Todos");

  const filtered = selectedMonth === "Todos"
    ? data
    : data.filter((d) => d.Mes === selectedMonth);

  const totalExport = filtered.reduce((sum, d) => sum + d.Exportado, 0);
  const totalFumig = filtered.reduce((sum, d) => sum + d.Fumigado, 0);
  const totalPres = filtered.reduce((sum, d) => sum + d.Presupuestado, 0);
  const porcentaje = totalExport > 0 ? ((totalFumig / totalExport) * 100).toFixed(1) + "%" : "0%";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard de Fumigación 2023</h1>

      <Filters selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Exportado (TM)" value={totalExport.toLocaleString()} />
        <SummaryCard title="Total Fumigado (TM)" value={totalFumig.toLocaleString()} />
        <SummaryCard title="Total Presupuestado (TM)" value={totalPres.toLocaleString()} />
        <SummaryCard title="% Participación" value={porcentaje} />
      </div>

      <MonthlyChart data={filtered} />

      <div>
        <ClientFumigationTable />
      </div>
    </div>
  );
}
