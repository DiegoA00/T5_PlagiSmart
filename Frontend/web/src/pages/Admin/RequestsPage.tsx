import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { BaseTable } from "./Components/BaseTable";
import { REQUESTS } from "@/constants/exampleRequests";
import { Request } from "@/types/request";
import { Overlay } from "@/layouts/Overlay";
import { OverlayContent } from "@/pages/Admin/Components/OverlayContent";
import { fumigationService } from "@/services/fumigationService";

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = REQUESTS.filter((r) => {
    const matchesClient = r.client.toLowerCase().includes(search.toLowerCase());
    const matchesDate = searchDate
      ? new Date(r.date).toDateString() === searchDate.toDateString()
      : true;
    return matchesClient && matchesDate;
  });

  const columns = [
    { header: "ID", key: "id" },
    { header: "Servicio", key: "service" },
    { header: "Cliente", key: "client" },
    { header: "Fecha Solicitud", key: "date" },
    { header: "Total Toneladas", key: "tons" },
  ];

  const handleViewDetails = async (request: Request) => {
    setIsLoading(true);
    setError(null);
    try {
      const applicationData = await fumigationService.getApplicationById(request.id);

      setSelectedRequest({
        ...request,
        applicationData,
      });
    } catch (err: any) {
      console.error("Error al obtener detalles de la solicitud:", err);
      setError(err.message || "Error al cargar los detalles de la solicitud");

      setSelectedRequest(request);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOverlay = () => {
    setSelectedRequest(null);
    setError(null);
  };

  return (
    <Layout>
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Solicitudes</h2>
          <p className="text-gray-500">Gestiona las solicitudes de servicio entrantes</p>
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
              onClick: handleViewDetails,
            },
          ]}
        />

        <Overlay open={!!selectedRequest} onClose={handleCloseOverlay}>
          {selectedRequest && (
            <OverlayContent
              request={selectedRequest}
              onClose={handleCloseOverlay}
              isLoading={isLoading}
              error={error}
            />
          )}
        </Overlay>
      </div>
    </Layout>
  );
}
