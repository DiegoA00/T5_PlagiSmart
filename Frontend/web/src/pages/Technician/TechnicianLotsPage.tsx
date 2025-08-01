import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "../Admin/Components/BaseTable";
import { REQUESTS } from "@/constants/exampleRequests";
import { LotStatus } from "@/types/lot";
import { LotOverlayContent } from "../Admin/Components/LotOverlayContent";
import { EvidenceOverlay } from "../Admin/Components/EvidenceOverlay";

const ACTIVE_LOTS: LotStatus[] = REQUESTS.flatMap((request) =>
  request.lots.map((lot) => ({
    ...lot,
    client: request.client,
    service: request.service,
    status: "pending" as const,
  }))
);

export default function TechnicianLotsPage() {
  const [search, setSearch] = useState("");
  const [selectedLot, setSelectedLot] = useState<LotStatus | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);

  const filtered = ACTIVE_LOTS.filter((lot) =>
    lot.client && lot.client.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "ID", key: "id" },
    { header: "Servicio", key: "service" },
    { header: "Cliente", key: "client" },
    {
      header: "Fecha Fumigación",
      key: "fumigationDate",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    { header: "Toneladas", key: "tons" },
  ];

  const handleCloseLotDetails = () => {
    setSelectedLot(null);
    setShowingEvidence(false);
  };

  const handleSaveEvidence = (data: any) => {
    console.log("Guardando evidencias:", data);
    // Aquí iría el código para enviar los datos al servidor
    // Por ahora solo mostramos los datos en la consola
    alert("Evidencias guardadas correctamente");
    handleCloseLotDetails();
  };

  return (
    <Layout userName="Técnico">
      <div className="p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold mb-1">Lotes Asignados</h2>
          <p className="text-gray-500">
            Gestiona las evidencias de fumigación y descarpe
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
              onClick: setSelectedLot,
            },
            {
              label: "Registrar Evidencias",
              onClick: (lot) => {
                setSelectedLot(lot);
                setShowingEvidence(true);
              },
            },
          ]}
        />

        {/* Overlay para información del lote */}
        <Overlay
          open={!!selectedLot && !showingEvidence}
          onClose={handleCloseLotDetails}
        >
          {selectedLot && <LotOverlayContent lot={selectedLot} onClose={handleCloseLotDetails} />}
        </Overlay>

        {/* Overlay para registrar evidencias - usando EvidenceOverlay en modo editable */}
        <Overlay
          open={!!selectedLot && showingEvidence}
          onClose={handleCloseLotDetails}
        >
          {selectedLot && <EvidenceOverlay 
            lot={selectedLot} 
            isEditable={true} // Modo técnico (edición)
            onClose={handleCloseLotDetails} 
            onSave={handleSaveEvidence}
          />}
        </Overlay>
      </div>
    </Layout>
  );
}