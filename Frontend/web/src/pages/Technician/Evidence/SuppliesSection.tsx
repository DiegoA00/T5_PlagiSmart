import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { CollapsibleSection } from "../../Admin/Components/Evidence/shared/CollapsibleSection";
import { FumigationData, Supply, ValidationErrors } from "../../../hooks/useFumigationEvidence";

interface SuppliesSectionProps {
  fumigationData: FumigationData;
  setFumigationData: React.Dispatch<React.SetStateAction<FumigationData>>;
  isEditable: boolean;
  fumigationReportSubmitted: boolean;
  validationErrors?: ValidationErrors;
  updateField: (field: keyof FumigationData, value: any) => void;
  addToArray: (field: keyof FumigationData, item: any) => void;
  removeFromArray: (field: keyof FumigationData, index: number) => void;
}

export const SuppliesSection: FC<SuppliesSectionProps> = ({
  fumigationData,
  setFumigationData,
  isEditable,
  fumigationReportSubmitted,
  validationErrors = {},
  updateField,
  addToArray,
  removeFromArray
}) => {
  const handleSupplyChange = (index: number, field: keyof Supply, value: string) => {
    if (field === 'quantity' || field === 'numberOfStrips') {
      if (value !== "") {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 0) {
          return;
        }
      }
    }
    
    const newSupplies = fumigationData.supplies.map((supply, i) => 
      i === index ? { ...supply, [field]: value } : supply
    );
    updateField('supplies', newSupplies);
  };

  const addSupply = () => {
    addToArray('supplies', { 
      name: "", 
      quantity: "", 
      dosage: "", 
      kindOfSupply: "", 
      numberOfStrips: "" 
    });
  };

  const removeSupply = (index: number) => {
    if (fumigationData.supplies.length > 1) {
      removeFromArray('supplies', index);
    }
  };

  return (
    <CollapsibleSection title="Suministros Utilizados" defaultOpen required>
      <div className="space-y-4">
        {fumigationData.supplies.map((supply, index) => (
          <div key={index} className={`grid grid-cols-5 gap-4 p-4 border rounded ${validationErrors.supplies ? 'border-red-200 bg-red-50' : ''}`}>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Producto</label>
              <Input 
                value={supply.name}
                onChange={(e) => handleSupplyChange(index, 'name', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="Nombre del producto"
                className={`${validationErrors.supplies ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Cantidad</label>
              <Input 
                type="number"
                step="0.1"
                min="0"
                value={supply.quantity}
                onChange={(e) => handleSupplyChange(index, 'quantity', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="0.0"
                className={`${validationErrors.supplies ? 'border-red-500 focus:border-red-500' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Dosis</label>
              <Input 
                value={supply.dosage}
                onChange={(e) => handleSupplyChange(index, 'dosage', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="ej: 5ml/m2"
                className={`${validationErrors.supplies ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 required-field">Tipo</label>
              <Input 
                value={supply.kindOfSupply}
                onChange={(e) => handleSupplyChange(index, 'kindOfSupply', e.target.value)}
                disabled={!isEditable || fumigationReportSubmitted}
                placeholder="Gas, Líquido, etc."
                className={`${validationErrors.supplies ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">N° Cintas</label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  min="0"
                  value={supply.numberOfStrips}
                  onChange={(e) => handleSupplyChange(index, 'numberOfStrips', e.target.value)}
                  disabled={!isEditable || fumigationReportSubmitted}
                  placeholder="0"
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                />
                {isEditable && !fumigationReportSubmitted && (
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSupply(index)}
                    disabled={fumigationData.supplies.length === 1}
                  >
                    <Minus size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {validationErrors.supplies && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.supplies}</p>
        )}
        {isEditable && !fumigationReportSubmitted && (
          <Button type="button" variant="outline" onClick={addSupply}>
            <Plus size={16} className="mr-2" />
            Agregar Suministro
          </Button>
        )}
      </div>
    </CollapsibleSection>
  );
};