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
  mode?: "fumigation" | "cleanup";
}

export const LotDetailsSection: FC<LotDetailsSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField,
  mode = "fumigation"
}) => {
  const handleLotDetailsChange = (field: keyof typeof fumigationData.lotDetails, value: string) => {
    const newLotDetails = {
      ...fumigationData.lotDetails,
      [field]: value
    };
    
    setFumigationData(prev => ({
      ...prev,
      lotDetails: newLotDetails
    }));
    
    updateField('lotDetails', newLotDetails);
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
              <label className="block text-sm font-medium mb-2">Número de Sacos</label>
              <Input 
                value={fumigationData.lotDetails.sacks}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Destino</label>
              <Input 
                value={fumigationData.lotDetails.portDestination}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            {mode === "cleanup" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Estado de Cintas <span className="text-red-500">*</span></label>
                  <Input 
                    value={fumigationData.lotDetails.stripsState || ""}
                    onChange={(e) => handleLotDetailsChange('stripsState', e.target.value)}
                    disabled={!isEditable || fumigationReportSubmitted}
                    placeholder="Ej: Bueno, Regular, Malo"
                    className={`${validationErrors.stripsState ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.stripsState && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.stripsState}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tiempo de Fumigación (horas) <span className="text-red-500">*</span></label>
                  <Input 
                    value={fumigationData.lotDetails.fumigationTime || ""}
                    onChange={(e) => handleLotDetailsChange('fumigationTime', e.target.value)}
                    disabled={!isEditable || fumigationReportSubmitted}
                    placeholder="Ej: 72"
                    type="number"
                    min="0"
                    step="1"
                    className={`${validationErrors.fumigationTime ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.fumigationTime && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.fumigationTime}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">PPM Fosfina <span className="text-red-500">*</span></label>
                  <Input 
                    value={fumigationData.lotDetails.ppmFosfina || ""}
                    onChange={(e) => handleLotDetailsChange('ppmFosfina', e.target.value)}
                    disabled={!isEditable || fumigationReportSubmitted}
                    placeholder="Ej: 25"
                    type="number"
                    min="0"
                    step="1"
                    className={`${validationErrors.ppmFosfina ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {validationErrors.ppmFosfina && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.ppmFosfina}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {mode === "fumigation" && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-gray-700 border-b border-gray-200 pb-1">
              Dimensiones del Lugar de Fumigación <span className="text-red-500">*</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Altura (m) <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium mb-2">Ancho (m) <span className="text-red-500">*</span></label>
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
                <label className="block text-sm font-medium mb-2">Largo (m) <span className="text-red-500">*</span></label>
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
        )}
      </div>
    </CollapsibleSection>
  );
};