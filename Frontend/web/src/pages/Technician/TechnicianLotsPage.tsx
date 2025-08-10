import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "../Admin/Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "../Admin/Components/LotOverlayContent";
import { TechnicianEvidenceOverlay } from "./TechnicianEvidenceOverlay";
import { useFumigationData, useFumigationDetails } from "@/hooks/useFumigationData";
import { formatDate } from "@/utils/dateUtils";
import { Toaster } from "sonner";

export default function TechnicianLotsPage() {
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
    { 
      header: "Fecha Planificada", 
      key: "plannedDate",
      render: (value: string) => formatDate(value)
    },
  ];

  const handleViewDetails = async (fumigation: FumigationListItem) => {
    setSelectedLotId(fumigation.id);
    setShowingEvidence(false);
    await loadFumigationDetails(fumigation.id);
  };

  const handleUploadEvidence = async (fumigation: FumigationListItem) => {
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
          <div className="text-red-500">Error: {error}</div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-10">
          <div className="text-center py-8">Cargando lotes asignados...</div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="p-10">
          <header className="mb-8">
            <h2 className="text-3xl font-bold mb-1">Lotes Asignados</h2>
            <p className="text-gray-500">Gestiona los lotes asignados para fumigación</p>
          </header>

          <div className="flex gap-4 items-center mb-6">
            <Input
              placeholder="Buscar por empresa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>

          <BaseTable
            data={filteredFumigations}
            columns={columns}
            actions={[
              {
                label: "Ver Información",
                onClick: handleViewDetails,
              },
              {
                label: "Subir Evidencias",
                onClick: handleUploadEvidence,
              },
            ]}
          />

          <Overlay open={!!selectedLotId && !showingEvidence} onClose={handleCloseDetails}>
            <LotOverlayContent 
              fumigationDetails={fumigationDetails} 
              loading={detailsLoading}
              onClose={handleCloseDetails} 
            />
          </Overlay>

          <Overlay open={!!selectedLotId && showingEvidence} onClose={handleCloseDetails}>
            <TechnicianEvidenceOverlay
              fumigationDetails={fumigationDetails}
              loading={detailsLoading}
              isEditable={true}
              onClose={handleCloseDetails}
            />
          </Overlay>
        </div>
      </Layout>
      <Toaster position="top-right" />
    </>
  );
}