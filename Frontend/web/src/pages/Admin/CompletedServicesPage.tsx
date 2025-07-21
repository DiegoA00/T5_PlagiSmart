import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "./Components/BaseTable";
import { REQUESTS } from "@/constants/exampleRequests";
import { CompletedLot } from "@/types/lot";
import { LotOverlayContent } from "./Components/LotOverlayContent";
import { EvidenceOverlay } from "./Components/EvidenceOverlay";

const COMPLETED_LOTS: CompletedLot[] = REQUESTS.flatMap((request) =>
  request.lots.map((lot) => ({
    ...lot,
    client: request.client,
    service: request.service,
    status: "completed" as const,
    completionDate: new Date().toISOString(),
    uncoveringDate: new Date().toISOString(),
  }))
);

export default function CompletedServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedLot, setSelectedLot] = useState<CompletedLot | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);

  const filtered = COMPLETED_LOTS.filter((lot) =>
    lot.client && lot.client.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "ID", key: "id" },
    { header: "Servicio", key: "service" },
    { header: "Cliente", key: "client" },
    {
      header: "Fecha Finalización",
      key: "completionDate",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    { header: "Toneladas", key: "tons" },
  ];

  const handleCloseLotDetails = () => {
    setSelectedLot(null);
    setShowingEvidence(false);
  };

  return (
    <Layout userName="Jose Jose">
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Servicios finalizados</h2>
          <p className="text-gray-500">Visualiza y gestiona los servicios completados</p>
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
              onClick: setSelectedLot,
            },
            {
              label: "Ver Evidencias",
              onClick: (lot) => {
                setSelectedLot(lot);
                setShowingEvidence(true);
              },
            },
            {
              label: "Generar Certificado",
              onClick: (lot) => {
                console.log("Generando certificado para:", lot.id);
              },
            },
          ]}
        />

        {/* Overlay para información del servicio */}
        <Overlay
          open={!!selectedLot && !showingEvidence}
          onClose={handleCloseLotDetails}
        >
          {selectedLot && <LotOverlayContent lot={selectedLot} onClose={handleCloseLotDetails} />}
        </Overlay>

        {/* Overlay para evidencias - usando EvidenceOverlay */}
        <Overlay
          open={!!selectedLot && showingEvidence}
          onClose={handleCloseLotDetails}
        >
          {selectedLot && <EvidenceOverlay 
            lot={selectedLot} 
            isEditable={false} // Modo administrador (solo visualización)
            onClose={handleCloseLotDetails} 
          />}
        </Overlay>
      </div>
    </Layout>
  );
}