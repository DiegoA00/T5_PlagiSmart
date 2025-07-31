import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "./Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "./Components/LotOverlayContent";
import { useFumigationData, useFumigationDetails } from "@/hooks/useFumigationData";

export default function LotsPage() {
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);

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

  const extractLotId = (fumigation: FumigationListItem): number => {
    // TODO: TEMPORAL - El backend debería incluir el 'id' en la respuesta de GET /fumigations
    // Por ahora extraemos un ID numérico del lotNumber o usamos el índice
    const numericId = parseInt(fumigation.lotNumber.replace(/\D/g, ''));
    const fallbackId = fumigations.indexOf(fumigation) + 1;
    const finalId = numericId || fallbackId;
    
    console.log(`🔢 LotsPage: Extrayendo ID del lote (TEMPORAL)`);
    console.log(`📝 Número de lote: "${fumigation.lotNumber}"`);
    console.log(`🧮 ID numérico extraído: ${numericId}`);
    console.log(`🔄 ID fallback (índice + 1): ${fallbackId}`);
    console.log(`✅ ID final a usar: ${finalId}`);
    console.warn(`⚠️  Esta lógica es temporal hasta que el backend incluya el 'id' real`);
    
    return finalId;
  };

  const handleViewDetails = async (fumigation: FumigationListItem) => {
    const lotId = extractLotId(fumigation);
    setSelectedLotId(lotId);
    await loadFumigationDetails(lotId);
  };

  const handleViewEvidence = async (fumigation: FumigationListItem) => {
    const lotId = extractLotId(fumigation);
    setSelectedLotId(lotId);
    setShowingEvidence(true);
    await loadFumigationDetails(lotId);
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
          <h2 className="text-3xl font-bold mb-1">Lotes a fumigar</h2>
          <p className="text-gray-500">Gestiona los lotes pendientes de fumigación</p>
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
          <div className="text-center py-8">Cargando lotes...</div>
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
            ]}
          />
        )}

        {/* Overlay para información del lote */}
        <Overlay open={!!selectedLotId && !showingEvidence} onClose={handleCloseDetails}>
          <LotOverlayContent 
            fumigationDetails={fumigationDetails} 
            loading={detailsLoading}
            onClose={handleCloseDetails} 
          />
        </Overlay>

        {/* Overlay para evidencias */}
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