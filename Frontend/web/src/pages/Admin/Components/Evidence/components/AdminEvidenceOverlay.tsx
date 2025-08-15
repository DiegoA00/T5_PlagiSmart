import { FC, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FumigationReportResponse, CleanupReportResponse } from "@/types/request";
import { reportsService } from "@/services/reportsService";
import { FumigationReportView } from "./FumigationReportView";
import { CleanupReportView } from "./CleanupReportView";

interface AdminEvidenceOverlayProps {
  fumigationId: number;
  onClose: () => void;
}

export const AdminEvidenceOverlay: FC<AdminEvidenceOverlayProps> = ({
  fumigationId,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState("fumigation");
  const [fumigationReport, setFumigationReport] = useState<FumigationReportResponse | null>(null);
  const [cleanupReport, setCleanupReport] = useState<CleanupReportResponse | null>(null);
  const [fumigationLoading, setFumigationLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [fumigationError, setFumigationError] = useState<string | null>(null);
  const [cleanupError, setCleanupError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "fumigation") {
      loadFumigationReport();
    } else if (activeTab === "cleanup") {
      loadCleanupReport();
    }
  }, [activeTab, fumigationId]);

  const loadFumigationReport = async () => {
    if (fumigationReport) return;
    
    setFumigationLoading(true);
    setFumigationError(null);
    try {
      const report = await reportsService.getFumigationReport(fumigationId);
      setFumigationReport(report);
    } catch (error: any) {
      console.error("Error loading fumigation report:", error);
      
      if (error.response?.status === 404) {
        setFumigationError("No se ha registrado un reporte de fumigación para este lote aún.");
      } else if (error.response?.status === 403) {
        setFumigationError("No tienes permisos para ver este reporte.");
      } else if (error.response?.status === 500) {
        setFumigationError("Error interno del servidor. Intenta nuevamente más tarde.");
      } else {
        setFumigationError(error.message || "Error desconocido al cargar el reporte de fumigación.");
      }
    } finally {
      setFumigationLoading(false);
    }
  };

  const loadCleanupReport = async () => {
    if (cleanupReport) return;
    
    setCleanupLoading(true);
    setCleanupError(null);
    try {
      const report = await reportsService.getCleanupReport(fumigationId);
      setCleanupReport(report);
    } catch (error: any) {
      console.error("Error loading cleanup report:", error);
      
      if (error.response?.status === 404) {
        setCleanupError("No se ha registrado un reporte de descarpe para este lote aún.");
      } else if (error.response?.status === 403) {
        setCleanupError("No tienes permisos para ver este reporte.");
      } else if (error.response?.status === 500) {
        setCleanupError("Error interno del servidor. Intenta nuevamente más tarde.");
      } else {
        setCleanupError(error.message || "Error desconocido al cargar el reporte de descarpe.");
      }
    } finally {
      setCleanupLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="bg-[#003595] text-white rounded-t-lg px-8 py-5 text-lg font-semibold">
        Evidencias de Fumigación - Lote ID: {fumigationId}
      </div>
      
      <div className="flex-1 overflow-hidden bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="w-full border-b rounded-none bg-gray-50">
            <TabsTrigger value="fumigation" className="flex-1">
              Registro de Fumigación
            </TabsTrigger>
            <TabsTrigger value="cleanup" className="flex-1">
              Registro de Descarpe
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fumigation" className="h-full overflow-y-auto p-6" style={{ maxHeight: "70vh" }}>
            <FumigationReportView
              report={fumigationReport}
              loading={fumigationLoading}
              error={fumigationError}
            />
          </TabsContent>

          <TabsContent value="cleanup" className="h-full overflow-y-auto p-6" style={{ maxHeight: "70vh" }}>
            <CleanupReportView
              report={cleanupReport}
              loading={cleanupLoading}
              error={cleanupError}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end gap-4 px-8 py-6 border-t border-[#003595] bg-white rounded-b-lg">
        <Button
          variant="secondary"
          className="bg-[#003595] text-white hover:bg-[#002060]"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};