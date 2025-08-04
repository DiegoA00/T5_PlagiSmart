import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "./Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "./Components/LotOverlayContent";
import { useFumigationData, useFumigationDetails } from "@/hooks/useFumigationData";
import { formatDate } from "@/utils/dateUtils";

export default function LotsPage() {
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);

  const { fumigations, fumigationsResponse, loading, error } = useFumigationData("APPROVED");
  const { fumigationDetails, loading: detailsLoading, loadFumigationDetails, clearDetails } = useFumigationDetails();

  const filteredFumigations = fumigations.filter((fumigation) =>
    fumigation.companyName && fumigation.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Número de Lote", key: "lotNumber" },
    { header: "Empresa", key: "companyName" },
    { header: "Representante", key: "representative" },
    { header: "Teléfono", key: "phoneNumber" },
    { header: "Ubicación", key: "location" },
    { 
      header: "Fecha Planificada", 
      key: "plannedDate",
      render: (value: string) => formatDate(value)
    },
  ];

  const handleViewDetails = async (fumigation: FumigationListItem) => {
    setSelectedLotId(fumigation.id);
    await loadFumigationDetails(fumigation.id);
  };

  const handleViewEvidence = async (fumigation: FumigationListItem) => {
    setSelectedLotId(fumigation.id);
    setShowingEvidence(true);
    await loadFumigationDetails(fumigation.id);
  };

  const handleCloseDetails = () => {
    setSelectedLotId(null);
    setShowingEvidence(false);
    clearDetails();
  };

  if (error) {
    return (
      <Layout>
        <div className="p-10">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
            <div className="text-red-600 text-sm mt-1">
              Revisa la consola del navegador para más detalles.
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Lotes a fumigar</h2>
          <p className="text-gray-500">
            Gestiona los lotes pendientes de fumigación
            {fumigationsResponse && fumigationsResponse.totalElements > 0 && 
              ` (${fumigationsResponse.totalElements} total${fumigationsResponse.totalElements !== 1 ? 'es' : ''})`
            }
          </p>
        </header>

        <div className="flex gap-4 items-center mb-6">
          <Input
            placeholder="Buscar por empresa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Cargando lotes aprobados...</div>
            <div className="text-gray-500 text-sm mt-2">
              Obteniendo fumigaciones con estado APPROVED
            </div>
          </div>
        ) : fumigations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No hay lotes aprobados</div>
            <div className="text-gray-400 text-sm mt-2">
              No se encontraron fumigaciones con estado APPROVED. 
              {fumigationsResponse?.totalElements === 0 
                ? " La base de datos parece estar vacía después del reinicio."
                : " Puede que no haya solicitudes aprobadas aún."
              }
            </div>
          </div>
        ) : (
          <>
            {filteredFumigations.length !== fumigations.length && (
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {filteredFumigations.length} de {fumigations.length} lotes (filtrados por "{search}")
              </div>
            )}
            
            <BaseTable
              data={filteredFumigations}
              columns={columns}
              actions={[
                {
                  label: "Ver Más Información",
                  onClick: handleViewDetails,
                },
                {
                  label: "Ver Evidencias",
                  onClick: handleViewEvidence,
                },
              ]}
            />
          </>
        )}

        <Overlay open={!!selectedLotId && !showingEvidence} onClose={handleCloseDetails}>
          <LotOverlayContent 
            fumigationDetails={fumigationDetails} 
            loading={detailsLoading}
            onClose={handleCloseDetails} 
          />
        </Overlay>

        <Overlay open={!!selectedLotId && showingEvidence} onClose={handleCloseDetails}>
          <LotOverlayContent
            fumigationDetails={fumigationDetails}
            loading={detailsLoading}
            isEvidence={true}
            onClose={handleCloseDetails}
          />
        </Overlay>
      </div>
    </Layout>
  );
}