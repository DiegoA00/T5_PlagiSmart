import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/layouts/Layout";
import { Overlay } from "@/layouts/Overlay";
import { BaseTable } from "./Components/BaseTable";
import { FumigationListItem } from "@/types/request";
import { LotOverlayContent } from "./Components/LotOverlayContent";
import { EvidenceOverlay } from "./Components/Evidence/EvidenceOverlay";
import { useFumigationDetails } from "@/hooks/useFumigationData";
import { fumigationService } from "@/services/fumigationService";
import { formatDate } from "@/utils/dateUtils";
import { Badge } from "@/components/ui/badge";

const FILTER_OPTIONS = [
  { value: "ALL", label: "Todos los lotes" },
  { value: "APPROVED", label: "Fumigación" },
  { value: "FUMIGATED", label: "Descarpe" }
];

interface ExtendedFumigationListItem extends FumigationListItem {
  status: string;
}

export default function LotsPage() {
  const [search, setSearch] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [showingEvidence, setShowingEvidence] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fumigations, setFumigations] = useState<ExtendedFumigationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fumigationDetails, loading: detailsLoading, loadFumigationDetails, clearDetails } = useFumigationDetails();

  useEffect(() => {
    const loadFumigations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let allFumigations: ExtendedFumigationListItem[] = [];

        if (statusFilter === "ALL") {
          const [approvedResponse, fumigatedResponse] = await Promise.all([
            fumigationService.getFumigationsByStatus("APPROVED"),
            fumigationService.getFumigationsByStatus("FUMIGATED")
          ]);
          
          const approvedWithStatus = approvedResponse.content.map(item => ({
            ...item,
            status: "APPROVED"
          }));
          
          const fumigatedWithStatus = fumigatedResponse.content.map(item => ({
            ...item,
            status: "FUMIGATED"
          }));
          
          allFumigations = [
            ...approvedWithStatus,
            ...fumigatedWithStatus
          ];
        } else {
          const response = await fumigationService.getFumigationsByStatus(statusFilter);
          allFumigations = response.content.map(item => ({
            ...item,
            status: statusFilter
          }));
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
      header: "Servicio",
      key: "status", 
      render: (value: string) => {
        switch (value) {
          case "APPROVED":
            return (
              <Badge 
                variant="default" 
                className="bg-blue-500 hover:bg-blue-600 text-white border-0"
              >
                Fumigación
              </Badge>
            );
          case "FUMIGATED":
            return (
              <Badge 
                variant="default" 
                className="bg-green-500 hover:bg-green-600 text-white border-0"
              >
                Descarpe
              </Badge>
            );
          default:
            return <Badge variant="outline">{value}</Badge>;
        }
      }
    },
  ];

  const handleViewDetails = async (fumigation: ExtendedFumigationListItem) => {
    setSelectedLotId(fumigation.id);
    setShowingEvidence(false);
    await loadFumigationDetails(fumigation.id);
  };

  const handleViewEvidence = async (fumigation: ExtendedFumigationListItem) => {
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
          <h2 className="text-3xl font-bold mb-1">Lotes de fumigación</h2>
          <p className="text-gray-500">
            Gestiona los lotes de fumigación y descarpe
            {fumigations.length > 0 && 
              ` (${fumigations.length} total${fumigations.length !== 1 ? 'es' : ''})`
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
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white border border-gray-300 hover:border-gray-400">
              <SelectValue placeholder="Filtrar por servicio" />
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

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Cargando lotes...</div>
            <div className="text-gray-500 text-sm mt-2">
              Obteniendo fumigaciones {statusFilter === "ALL" ? "de fumigación y descarpe" : statusFilter === "APPROVED" ? "de fumigación" : "de descarpe"}
            </div>
          </div>
        ) : fumigations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No hay lotes {statusFilter === "ALL" ? "" : statusFilter === "APPROVED" ? "de fumigación" : "de descarpe"}
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {statusFilter === "ALL" 
                ? "No se encontraron lotes de fumigación o descarpe."
                : `No se encontraron lotes ${statusFilter === "APPROVED" ? "de fumigación" : "de descarpe"}.`
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
          <EvidenceOverlay
            fumigationDetails={fumigationDetails}
            loading={detailsLoading}
            isEditable={false}
            onClose={handleCloseDetails}
          />
        </Overlay>
      </div>
    </Layout>
  );
}