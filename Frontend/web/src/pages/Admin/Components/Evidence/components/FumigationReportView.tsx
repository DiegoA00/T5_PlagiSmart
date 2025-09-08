import { FC } from "react";
import { FumigationReportResponse } from "@/types/request";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { AdminSignaturesView } from "./AdminSignaturesView";

interface FumigationReportViewProps {
  report: FumigationReportResponse | null;
  loading: boolean;
  error: string | null;
}

export const FumigationReportView: FC<FumigationReportViewProps> = ({
  report,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003595]"></div>
        <div className="text-gray-500">Cargando registro de fumigación...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center max-w-md">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 21.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-amber-800 mb-2">
              Registro no disponible
            </h3>
            <p className="text-amber-700 text-sm">
              {error}
            </p>
            {error.includes("No se ha registrado") && (
              <p className="text-amber-600 text-xs mt-2">
                El técnico aún no ha subido las evidencias para este lote.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CollapsibleSection title="Información General" defaultOpen>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Número de Lote</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.fumigationInfo.lotNumber}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ubicación</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.location}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.date}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hora de Inicio</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.startTime}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hora de Fin</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.endTime}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Personal que Interviene" defaultOpen>
        <div className="space-y-2">
          {report.technicians.map((technician, index) => (
            <div key={technician.id} className="p-3 bg-gray-50 rounded border">
              <div className="font-medium">
                Técnico {index + 1}: {technician.firstName} {technician.lastName}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Detalles del Lote" defaultOpen>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Número de Lote</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.fumigationInfo.lotNumber}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Toneladas</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.fumigationInfo.ton}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Calidad</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.fumigationInfo.quality}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Número de Sacos</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.fumigationInfo.sacks}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Destino</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.fumigationInfo.portDestination}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estado</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.fumigationInfo.status}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Dimensiones" defaultOpen>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Altura (m)</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.dimensions.height}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ancho (m)</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.dimensions.width}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Largo (m)</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.dimensions.length}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Condiciones Ambientales" defaultOpen>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Temperatura (°C)</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.environmentalConditions.temperature}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Humedad (%)</label>
            <div className="p-2 bg-gray-50 rounded border">
              {report.environmentalConditions.humidity}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Condiciones de Seguridad Industrial" defaultOpen>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={report.industrialSafetyConditions.electricDanger}
                disabled
                className="mr-2"
              />
              <label>Peligro Eléctrico</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={report.industrialSafetyConditions.fallingDanger}
                disabled
                className="mr-2"
              />
              <label>Peligro de Caída</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={report.industrialSafetyConditions.hitDanger}
                disabled
                className="mr-2"
              />
              <label>Peligro de Golpe</label>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Suministros Utilizados" defaultOpen>
        <div className="space-y-4">
          {report.supplies.map((supply, index) => (
            <div key={supply.id} className="p-4 bg-gray-50 rounded border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <div className="text-sm">{supply.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <div className="text-sm">{supply.quantity}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dosificación</label>
                  <div className="text-sm">{supply.dosage}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Suministro</label>
                  <div className="text-sm">{supply.kindOfSupply}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Número de Tiras</label>
                  <div className="text-sm">{supply.numberOfStrips}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Observaciones" defaultOpen>
        <div className="p-4 bg-gray-50 rounded border min-h-24">
          {report.observations || "Sin observaciones"}
        </div>
      </CollapsibleSection>

      <AdminSignaturesView 
        signatures={report.signatures || []}
        isLoading={loading}
      />
    </div>
  );
};