import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { BaseTable } from "./Components/BaseTable";
import { ApiFumigationApplication, PaginatedResponse } from "@/types/request";
import { Overlay } from "@/layouts/Overlay";
import { OverlayContent } from "@/pages/Admin/Components/OverlayContent";
import { fumigationService } from "@/services/fumigationService";

export default function RequestsPage() {
  const [applications, setApplications] = useState<ApiFumigationApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApiFumigationApplication[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [selectedRequest, setSelectedRequest] = useState<ApiFumigationApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statuses = ["PENDING", "REJECTED"];

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  useEffect(() => {
    if (Array.isArray(applications) && applications.length > 0) {
      const filtered = applications.filter((app) =>
        app.companyName.toLowerCase().includes(search.toLowerCase()) ||
        app.representative.toLowerCase().includes(search.toLowerCase()) ||
        app.location.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications([]);
    }
  }, [search, applications]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let response: PaginatedResponse<ApiFumigationApplication>;

      if (selectedStatus === "PENDING") {
        response = await fumigationService.getPendingApplications();
      } else {
        response = await fumigationService.getRejectedApplications();
      }

      const data = response.content || [];
      setApplications(data);
      setFilteredApplications(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { header: "ID", key: "id" },
    { header: "Empresa", key: "companyName" },
    { header: "Representante", key: "representative" },
    { header: "Ubicación", key: "location" },
    { header: "Fecha de Solicitud", key: "localDate" },
    { header: "Estado", key: "status" },
  ];

  const handleViewDetails = async (application: ApiFumigationApplication) => {
    setIsDetailLoading(true);
    setError(null);
    try {
      const applicationData = await fumigationService.getApplicationById(application.id.toString());

      setSelectedRequest({
        ...application,
        applicationData,
      } as any);
    } catch (err: any) {
      setError(err.message || "Error al cargar los detalles de la solicitud");
      setSelectedRequest(application);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseOverlay = () => {
    setSelectedRequest(null);
    setError(null);
  };

  const handleRefresh = () => {
    fetchApplications();
  };

  return (
    <Layout>
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Solicitudes de Fumigación</h2>
          <p className="text-gray-500">Gestiona las solicitudes de servicio de fumigación</p>
        </header>

        <div className="flex gap-4 items-center mb-6">
          <Input
            placeholder="Buscar por empresa, representante o ubicación"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003595] focus:border-transparent"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "PENDING" ? "Pendientes" : "Rechazadas"}
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
            <span className="animate-spin mr-2">⌛</span> Cargando solicitudes...
          </div>
        ) : (
          <>
            <BaseTable
              data={filteredApplications}
              columns={columns}
              actions={[
                {
                  label: "Ver Más Información",
                  onClick: handleViewDetails,
                },
              ]}
            />

            {filteredApplications.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron solicitudes con los criterios de búsqueda.
              </div>
            )}
          </>
        )}

        <Overlay open={!!selectedRequest} onClose={handleCloseOverlay}>
          {selectedRequest && (
            <OverlayContent
              request={selectedRequest as any}
              onClose={handleCloseOverlay}
              onRefresh={handleRefresh}
              isLoading={isDetailLoading}
              error={error}
            />
          )}
        </Overlay>
      </div>
    </Layout>
  );
}
