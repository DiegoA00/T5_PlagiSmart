import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "../Admin/Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "../Admin/Components/LotOverlayContent";
import { EvidenceOverlay } from "../Admin/Components/EvidenceOverlay";
import { useFumigationData, useFumigationDetails } from "@/hooks/useFumigationData";

export default function TechnicianLotsPage() {
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);

  // Usar el hook para obtener lotes con status "APPROVED" (lotes asignados al técnico)
  const { fumigations, loading, error } = useFumigationData("APPROVED");
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
    // Extraer el ID del número de lote o usar un índice temporal
    const lotId = parseInt(fumigation.lotNumber.replace(/\D/g, '')) || fumigations.indexOf(fumigation) + 1;
    setSelectedLotId(lotId);
    await loadFumigationDetails(lotId);
  };

  const handleRegisterEvidence = async (fumigation: FumigationListItem) => {
    const lotId = parseInt(fumigation.lotNumber.replace(/\D/g, '')) || fumigations.indexOf(fumigation) + 1;
    setSelectedLotId(lotId);
    setShowingEvidence(true);
    await loadFumigationDetails(lotId);
  };

  const handleCloseLotDetails = () => {
    setSelectedLotId(null);
    setShowingEvidence(false);
    clearDetails();
  };

  const handleSaveEvidence = (evidenceData: any) => {
    console.log("Guardando evidencias:", evidenceData);
    // Aquí iría el código para enviar los datos al servidor
    // Por ahora solo mostramos los datos en la consola
    alert("Evidencias guardadas correctamente");
    handleCloseLotDetails();
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
          <h2 className="text-3xl font-bold mb-1">Lotes Asignados</h2>
          <p className="text-gray-500">
            Gestiona las evidencias de fumigación y descarpe
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
          <div className="text-center py-8">Cargando lotes asignados...</div>
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
                label: "Registrar Evidencias",
                onClick: handleRegisterEvidence,
              },
            ]}
          />
        )}

        <Overlay
          open={!!selectedLotId && !showingEvidence}
          onClose={handleCloseLotDetails}
        >
          <LotOverlayContent 
            fumigationDetails={fumigationDetails} 
            loading={detailsLoading}
            onClose={handleCloseLotDetails} 
          />
        </Overlay>

        <Overlay
          open={!!selectedLotId && showingEvidence}
          onClose={handleCloseLotDetails}
        >
          <EvidenceOverlay 
            fumigationDetails={fumigationDetails}
            loading={detailsLoading}
            isEditable={true}
            onClose={handleCloseLotDetails} 
            onSave={handleSaveEvidence}
          />
        </Overlay>
      </div>
    </Layout>
  );
}