import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "../Admin/Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "../Admin/Components/LotOverlayContent";
import { TechnicianEvidenceOverlay } from "./TechnicianEvidenceOverlay";
import { useFumigationDetails } from "@/hooks/useFumigationData";
import { fumigationService } from "@/services/fumigationService";
import { formatDate } from "@/utils/dateUtils";
import { Toaster } from "sonner";

const FILTER_OPTIONS = [
  { value: "ALL", label: "Todos los lotes" },
  { value: "APPROVED", label: "Fumigación" },
  { value: "FUMIGATED", label: "Descarpe" }
];

export default function TechnicianLotsPage() {
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fumigations, setFumigations] = useState<FumigationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fumigationDetails, loading: detailsLoading, loadFumigationDetails, clearDetails } = useFumigationDetails();

  useEffect(() => {
    const loadFumigations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let allFumigations: FumigationListItem[] = [];

        if (statusFilter === "ALL") {
          const [approvedResponse, fumigatedResponse] = await Promise.all([
            fumigationService.getFumigationsByStatus("APPROVED"),
            fumigationService.getFumigationsByStatus("FUMIGATED")
          ]);
          
          allFumigations = [
            ...approvedResponse.content,
            ...fumigatedResponse.content
          ];
        } else {
          const response = await fumigationService.getFumigationsByStatus(statusFilter);
          allFumigations = response.content;
        }

        setFumigations(allFumigations);
      } catch (err: any) {
        setError(err.message || "Error al cargar los lotes");
      } finally {
        setLoading(false);
      }
    };

    loadFumigations();
  }, [statusFilter]);

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
    {
      header: "Estado",
      key: "status",
      render: (value: string) => {
        const statusLabels: { [key: string]: string } = {
          "APPROVED": "Fumigación",
          "FUMIGATED": "Descarpe"
        };
        return statusLabels[value] || value;
      }
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

  const handleEvidenceSubmitted = async () => {
    try {
      let allFumigations: FumigationListItem[] = [];

      if (statusFilter === "ALL") {
        const [approvedResponse, fumigatedResponse] = await Promise.all([
          fumigationService.getFumigationsByStatus("APPROVED"),
          fumigationService.getFumigationsByStatus("FUMIGATED")
        ]);
        
        allFumigations = [
          ...approvedResponse.content,
          ...fumigatedResponse.content
        ];
      } else {
        const response = await fumigationService.getFumigationsByStatus(statusFilter);
        allFumigations = response.content;
      }

      setFumigations(allFumigations);
    } catch (err) {
      console.error("Error al refrescar la lista:", err);
    }
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
            <p className="text-gray-500">Gestiona los lotes asignados para fumigación y descarpe</p>
          </header>

          <div className="flex gap-4 items-center mb-6">
            <Input
              placeholder="Buscar por empresa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white border border-gray-300 hover:border-gray-400">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {FILTER_OPTIONS.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="bg-white hover:bg-gray-100 cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              onSave={handleEvidenceSubmitted}
            />
          </Overlay>
        </div>
      </Layout>
      <Toaster position="top-right" />
    </>
  );
}