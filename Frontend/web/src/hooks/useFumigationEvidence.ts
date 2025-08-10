import { useState } from "react";

export interface Supply {
  name: string;
  quantity: string;
  dosage: string;
  kindOfSupply: string;
  numberOfStrips: string;
}

export interface Dimensions {
  height: string;
  width: string;
  length: string;
}

export interface EnvironmentalConditions {
  temperature: string;
  humidity: string;
}

export interface Hazards {
  electricDanger: boolean;
  fallingDanger: boolean;
  hitDanger: boolean;
}

export interface LotDetails {
  lotNumber: string;
  tons: string;
  quality: string;
  sacks: string;
  destination: string;
}

export interface ValidationErrors {
  startTime?: string;
  endTime?: string;
  technicians?: string;
  dimensions?: string;
  temperature?: string;
  humidity?: string;
  supplies?: string;
  timeRange?: string;
}

export interface FumigationData {
  fumigationId: string;
  registrationNumber: string;
  company: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  supervisor: string;
  
  lotDetails: LotDetails;
  
  dimensions: Dimensions;
  
  environmentalConditions: EnvironmentalConditions;
  
  selectedTechnician: string;
  technicians: Array<{
    id: number;
    name: string;
    role: string;
  }>;
  
  hazards: Hazards;
  
  supplies: Supply[];
  
  observations: string;
}

export const useFumigationEvidence = (initialData?: any) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [fumigationData, setFumigationData] = useState<FumigationData>({
    fumigationId: initialData?.id?.toString() || "",
    registrationNumber: initialData?.registrationNumber || "",
    company: initialData?.company?.businessName || "",
    location: initialData?.company?.address || "",
    date: getCurrentDate(),
    startTime: "",
    endTime: "",
    supervisor: initialData?.representative || "",
    lotDetails: {
      lotNumber: initialData?.lot?.lotNumber || "",
      tons: initialData?.lot?.tons?.toString() || "",
      quality: initialData?.lot?.quality || "",
      sacks: initialData?.lot?.sacks?.toString() || "",
      destination: initialData?.lot?.portDestination || ""
    },
    dimensions: {
      height: "",
      width: "",
      length: ""
    },
    environmentalConditions: {
      temperature: "",
      humidity: ""
    },
    selectedTechnician: "",
    technicians: [],
    hazards: {
      electricDanger: false,
      fallingDanger: false,
      hitDanger: false
    },
    supplies: [{
      name: "",
      quantity: "",
      dosage: "",
      kindOfSupply: "",
      numberOfStrips: ""
    }],
    observations: ""
  });

  const resetForm = () => {
    setFumigationData({
      fumigationId: "",
      registrationNumber: "",
      company: "",
      location: "",
      date: getCurrentDate(),
      startTime: "",
      endTime: "",
      supervisor: "",
      lotDetails: {
        lotNumber: "",
        tons: "",
        quality: "",
        sacks: "",
        destination: ""
      },
      dimensions: {
        height: "",
        width: "",
        length: ""
      },
      environmentalConditions: {
        temperature: "",
        humidity: ""
      },
      selectedTechnician: "",
      technicians: [],
      hazards: {
        electricDanger: false,
        fallingDanger: false,
        hitDanger: false
      },
      supplies: [{
        name: "",
        quantity: "",
        dosage: "",
        kindOfSupply: "",
        numberOfStrips: ""
      }],
      observations: ""
    });
    setValidationErrors({});
  };

  const validateFumigationForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!fumigationData.startTime || fumigationData.startTime.trim() === "") {
      errors.startTime = "La hora de inicio es requerida";
    }
    
    if (!fumigationData.endTime || fumigationData.endTime.trim() === "") {
      errors.endTime = "La hora de finalización es requerida";
    }

    if (fumigationData.startTime && fumigationData.endTime && fumigationData.startTime >= fumigationData.endTime) {
      errors.timeRange = "La hora de finalización debe ser posterior a la hora de inicio";
    }
    
    if (fumigationData.technicians.length === 0) {
      errors.technicians = "Se requiere al menos un técnico asignado";
    }
    
    const { height, width, length } = fumigationData.dimensions;
    if (!height || !width || !length || height.trim() === "" || width.trim() === "" || length.trim() === "") {
      errors.dimensions = "Todas las dimensiones son requeridas (altura, ancho y largo)";
    } else {
      const heightNum = parseFloat(height);
      const widthNum = parseFloat(width);
      const lengthNum = parseFloat(length);
      
      if (isNaN(heightNum) || isNaN(widthNum) || isNaN(lengthNum)) {
        errors.dimensions = "Las dimensiones deben ser números válidos";
      } else if (heightNum <= 0 || widthNum <= 0 || lengthNum <= 0) {
        errors.dimensions = "Las dimensiones deben ser mayores a 0";
      }
    }
    
    const { temperature, humidity } = fumigationData.environmentalConditions;
    if (!temperature || temperature.trim() === "") {
      errors.temperature = "La temperatura es requerida";
    } else {
      const tempNum = parseFloat(temperature);
      if (isNaN(tempNum)) {
        errors.temperature = "La temperatura debe ser un número válido";
      }
    }
    
    if (!humidity || humidity.trim() === "") {
      errors.humidity = "La humedad es requerida";
    } else {
      const humidityNum = parseFloat(humidity);
      if (isNaN(humidityNum) || humidityNum < 0 || humidityNum > 100) {
        errors.humidity = "La humedad debe ser un número entre 0% y 100%";
      }
    }
    
    if (fumigationData.supplies.length === 0) {
      errors.supplies = "Se requiere al menos un suministro";
    } else {
      for (let i = 0; i < fumigationData.supplies.length; i++) {
        const supply = fumigationData.supplies[i];
        
        if (!supply.name || !supply.quantity || !supply.dosage || !supply.kindOfSupply ||
            supply.name.trim() === "" || supply.quantity.trim() === "" || 
            supply.dosage.trim() === "" || supply.kindOfSupply.trim() === "") {
          errors.supplies = `Campos requeridos faltantes en el suministro ${i + 1}`;
          break;
        }
        
        const quantityNum = parseFloat(supply.quantity);
        if (isNaN(quantityNum) || quantityNum <= 0) {
          errors.supplies = `La cantidad debe ser un número positivo en el suministro ${i + 1}`;
          break;
        }
        
        if (supply.numberOfStrips && supply.numberOfStrips.trim() !== "") {
          const stripsNum = parseFloat(supply.numberOfStrips);
          if (isNaN(stripsNum) || stripsNum < 0) {
            errors.supplies = `El número de cintas debe ser un número no negativo en el suministro ${i + 1}`;
            break;
          }
        }
      }
    }
    
    setValidationErrors(errors);
    
    const hasErrors = Object.keys(errors).length > 0;
    return !hasErrors;
  };

  const updateField = (field: keyof FumigationData, value: any) => {
    setFumigationData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const addToArray = (field: keyof FumigationData, item: any) => {
    setFumigationData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), item]
    }));
  };

  const removeFromArray = (field: keyof FumigationData, index: number) => {
    setFumigationData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  return {
    fumigationData,
    setFumigationData,
    resetForm,
    validateFumigationForm,
    validationErrors,
    clearValidationErrors,
    updateField,
    addToArray,
    removeFromArray
  };
};