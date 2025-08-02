import { FC } from "react";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "../shared/CollapsibleSection";
import { FumigationData } from "../hooks/useFumigationData";

interface DimensionsSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
}

export const DimensionsSection: FC<DimensionsSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted
}) => {
  const handleDimensionChange = (field: keyof typeof fumigationData.dimensions, value: string) => {
    const numericValue = parseFloat(value);
    if (value !== "" && (isNaN(numericValue) || numericValue < 0)) {
      return;
    }
    
    setFumigationData(prev => ({ 
      ...prev, 
      dimensions: { ...prev.dimensions, [field]: value }
    }));
  };

  return (
    <CollapsibleSection title="Dimensiones del Lugar" defaultOpen required>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Altura (m)</label>
          <Input 
            type="number"
            step="0.1"
            min="0"
            value={fumigationData.dimensions.height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="0.0"
            onKeyDown={(e) => {
              // Bloquear teclas de signo negativo
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Ancho (m)</label>
          <Input 
            type="number"
            step="0.1"
            min="0"
            value={fumigationData.dimensions.width}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="0.0"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 required-field">Largo (m)</label>
          <Input 
            type="number"
            step="0.1"
            min="0"
            value={fumigationData.dimensions.length}
            onChange={(e) => handleDimensionChange('length', e.target.value)}
            disabled={!isEditable || fumigationReportSubmitted}
            placeholder="0.0"
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};