import { FC } from "react";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData, ValidationErrors } from "../hooks/useFumigationData";

interface LotDetailsSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
}

export const LotDetailsSection: FC<LotDetailsSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField
}) => {
  const handleLotDetailsChange = (field: keyof typeof fumigationData.lotDetails, value: string) => {
    updateField('lotDetails', {
      ...fumigationData.lotDetails,
      [field]: value
    });
  };

  const handleDimensionsChange = (field: keyof typeof fumigationData.dimensions, value: string) => {
    updateField('dimensions', {
      ...fumigationData.dimensions,
      [field]: value
    });
  };

  return (
    <CollapsibleSection title="Detalles del Lote" defaultOpen>
      <div className="space-y-6">
        {/* Información del Lote (Solo lectura) */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Información del Lote</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Número de Lote</label>
              <Input 
                value={fumigationData.lotDetails.lotNumber}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Toneladas</label>
              <Input 
                value={fumigationData.lotDetails.tons}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Calidad</label>
              <Input 
                value={fumigationData.lotDetails.quality}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sacos</label>
              <Input 
                value={fumigationData.lotDetails.sacks}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium mb-2">Destino</label>
              <Input 
                value={fumigationData.lotDetails.destination}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Dimensiones del Lugar de Fumigación (Editable) */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-gray-700 border-b border-gray-200 pb-1">
            Dimensiones del Lugar de Fumigación <span className="required-field"></span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Altura (m)</label>
              <Input 
                type="number"
                step="0.01"
                min="0"
                value={fumigationData.dimensions.height}
                onChange={(e) => handleDimensionsChange('height', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="0.00"
                className={`${validationErrors.dimensions ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Ancho (m)</label>
              <Input 
                type="number"
                step="0.01"
                min="0"
                value={fumigationData.dimensions.width}
                onChange={(e) => handleDimensionsChange('width', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="0.00"
                className={`${validationErrors.dimensions ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Largo (m)</label>
              <Input 
                type="number"
                step="0.01"
                min="0"
                value={fumigationData.dimensions.length}
                onChange={(e) => handleDimensionsChange('length', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="0.00"
                className={`${validationErrors.dimensions ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
          </div>
          {validationErrors.dimensions && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.dimensions}</p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};