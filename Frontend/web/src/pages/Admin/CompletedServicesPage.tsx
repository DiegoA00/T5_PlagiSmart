import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "./Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "./Components/LotOverlayContent";
import { useFumigationData, useFumigationDetails } from "@/hooks/useFumigationData";

export default function CompletedServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);

  const { fumigations, loading, error } = useFumigationData("FINISHED");
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
  ];

  const handleViewDetails = async (fumigation: FumigationListItem) => {
    const lotId = parseInt(fumigation.lotNumber.replace(/\D/g, '')) || fumigations.indexOf(fumigation) + 1;
    setSelectedLotId(lotId);
    await loadFumigationDetails(lotId);
  };

  const handleViewEvidence = async (fumigation: FumigationListItem) => {
    const lotId = parseInt(fumigation.lotNumber.replace(/\D/g, '')) || fumigations.indexOf(fumigation) + 1;
    setSelectedLotId(lotId);
    setShowingEvidence(true);
    await loadFumigationDetails(lotId);
  };

  const handleGenerateCertificate = (fumigation: FumigationListItem) => {
    console.log("Generando certificado para:", fumigation.lotNumber);
    // Implementar lógica de generación de certificado
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
          <div className="text-red-500">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Servicios finalizados</h2>
          <p className="text-gray-500">Visualiza y gestiona los servicios completados</p>
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
          <div className="text-center py-8">Cargando servicios...</div>
        ) : (
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
              {
                label: "Generar Certificado",
                onClick: handleGenerateCertificate,
              },
            ]}
          />
        )}

        {/* Overlay para información del servicio */}
        <Overlay
          open={!!selectedLotId && !showingEvidence}
          onClose={handleCloseDetails}
        >
          <LotOverlayContent 
            fumigationDetails={fumigationDetails} 
            loading={detailsLoading}
            onClose={handleCloseDetails} 
          />
        </Overlay>

        {/* Overlay para evidencias */}
        <Overlay
          open={!!selectedLotId && showingEvidence}
          onClose={handleCloseDetails}
        >
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