// src/pages/RequestsPage.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { BaseTable } from "./Components/BaseTable";
import { REQUESTS } from "@/constants/exampleRequests";
import { Request } from "@/types/request";
import { Overlay } from "@/layouts/Overlay";
import { OverlayContent } from "@/pages/Admin/Components/OverlayContent";

export default function AdminHome() {
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const filtered = REQUESTS.filter((r) => {
    const matchesClient = r.client.toLowerCase().includes(search.toLowerCase());
    const matchesDate = searchDate
      ? new Date(r.date).toDateString() === searchDate.toDateString()
      : true;
    return matchesClient && matchesDate;
  });

  // Definimos las columnas para la tabla
  const columns = [
    { header: "ID", key: "id" },
    { header: "Servicio", key: "service" },
    { header: "Cliente", key: "client" },
    { header: "Fecha Solicitud", key: "date" },
    { header: "Total Toneladas", key: "tons" },
  ];

  return (
    <Layout userName="Jose Jose">
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Solicitudes</h2>
          <p className="text-gray-500">
            Gestiona las solicitudes de servicio entrantes
          </p>
        </header>

        <div className="flex gap-4 items-center mb-6">
          <Input
            placeholder="Buscar por cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        <BaseTable
          data={filtered}
          columns={columns}
          actions={[
            {
              label: "Ver Más Información",
              onClick: setSelectedRequest,
            },
          ]}
        />

        <Overlay
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        >
          {selectedRequest && (
            <OverlayContent
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
            />
          )}
        </Overlay>
      </div>
    </Layout>
  );
}
