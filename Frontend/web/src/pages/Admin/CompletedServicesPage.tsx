import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "./Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "./Components/LotOverlayContent";
import { EvidenceOverlay } from "./Components/Evidence/EvidenceOverlay";
import { CertificateOverlay } from "@/components/Certificate/CertificateOverlay";
import { useFumigationData, useFumigationDetails } from "@/hooks/useFumigationData";

export default function CompletedServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);
  const [showingCertificate, setShowingCertificate] = useState(false);
  const [selectedFumigationStatus, setSelectedFumigationStatus] = useState<string | null>(null);

  const { fumigations, fumigationsResponse, loading, error } = useFumigationData("FINISHED");
  const { fumigationDetails, loading: detailsLoading, loadFumigationDetails, clearDetails } = useFumigationDetails();

  const filteredFumigations = fumigations.filter((fumigation) =>
    fumigation.companyName && fumigation.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Número de Lote", key: "lotNumber" },
    { header: "Empresa", key: "companyName" },
    { header: "Representante", key: "representative" },
    { header: "Teléfono", key: "phoneNumber" },
  ];

  const handleViewDetails = async (fumigation: FumigationListItem) => {
    setSelectedLotId(fumigation.id);
    setShowingEvidence(false);
    setShowingCertificate(false);
    setSelectedFumigationStatus(null);
    await loadFumigationDetails(fumigation.id);
  };

  const handleViewEvidence = async (fumigation: FumigationListItem) => {
    setSelectedLotId(fumigation.id);
    setShowingEvidence(true);
    setShowingCertificate(false);
    setSelectedFumigationStatus("FINISHED");
    await loadFumigationDetails(fumigation.id);
  };

  const handleGenerateCertificate = (fumigation: FumigationListItem) => {
    setSelectedLotId(fumigation.id);
    setShowingEvidence(false);
    setShowingCertificate(true);
    setSelectedFumigationStatus(null);
  };

  const handleCloseDetails = () => {
    setSelectedLotId(null);
    setShowingEvidence(false);
    setShowingCertificate(false);
    setSelectedFumigationStatus(null);
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
          <h2 className="text-3xl font-bold mb-1">Servicios Completados</h2>
          <p className="text-gray-500">
            Gestiona los lotes con servicio completado
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
            <div className="text-lg">Cargando lotes completados...</div>
            <div className="text-gray-500 text-sm mt-2">
              Obteniendo fumigaciones con estado FINISHED
            </div>
          </div>
        ) : fumigations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No hay servicios completados</div>
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
                {
                  label: "Generar Certificado",
                  onClick: handleGenerateCertificate,
                },
              ]}
            />
          </>
        )}

        <Overlay
          open={!!selectedLotId && !showingEvidence && !showingCertificate}
          onClose={handleCloseDetails}
        >
          <LotOverlayContent 
            fumigationDetails={fumigationDetails} 
            loading={detailsLoading}
            onClose={handleCloseDetails} 
          />
        </Overlay>

        <Overlay
          open={!!selectedLotId && showingEvidence}
          onClose={handleCloseDetails}
        >
          <EvidenceOverlay
            fumigationDetails={fumigationDetails}
            loading={detailsLoading}
            isEditable={false}
            fumigationStatus={selectedFumigationStatus}
            onClose={handleCloseDetails}
          />
        </Overlay>

        <Overlay
          open={!!selectedLotId && showingCertificate}
          onClose={handleCloseDetails}
        >
          <CertificateOverlay
            fumigationId={selectedLotId!}
            onClose={handleCloseDetails}
          />
        </Overlay>
      </div>
    </Layout>
  );
}