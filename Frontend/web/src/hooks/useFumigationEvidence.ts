import { useState, useEffect } from "react";
import { FumigationDetailResponse } from "@/types/request";

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
  stripsState?: string;
  fumigationTime?: string;
  ppmFosfina?: string;
}

export interface ValidationErrors {
  startTime?: string;
  endTime?: string;
  supervisor?: string;
  technicians?: string;
  dimensions?: string;
  temperature?: string;
  humidity?: string;
  supplies?: string;
  timeRange?: string;
  fumigationTime?: string;
  ppmFosfina?: string;
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

export const useFumigationEvidence = (fumigationDetails: FumigationDetailResponse | null) => {
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
    supplies: [],
    observations: ""
  });

  useEffect(() => {
    if (fumigationDetails) {
      setFumigationData(prev => ({
        ...prev,
        fumigationId: fumigationDetails.lot.id.toString(),
        registrationNumber: fumigationDetails.lot.lotNumber,
        company: fumigationDetails.company.businessName,
        location: fumigationDetails.company.address,
        supervisor: "",
        lotDetails: {
          lotNumber: fumigationDetails.lot.lotNumber,
          tons: fumigationDetails.lot.tons.toString(),
          quality: fumigationDetails.lot.quality,
          sacks: fumigationDetails.lot.sacks.toString(),
          destination: fumigationDetails.lot.portDestination
        }
      }));
    }
  }, [fumigationDetails]);

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

    if (!fumigationData.supervisor || fumigationData.supervisor.trim() === "") {
      errors.supervisor = "El nombre del supervisor es requerido";
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
      const humNum = parseFloat(humidity);
      if (isNaN(humNum)) {
        errors.humidity = "La humedad debe ser un número válido";
      }
    }
    
    if (fumigationData.supplies.length === 0) {
      errors.supplies = "Se requiere al menos un suministro";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateField = (field: keyof FumigationData, value: any) => {
    setFumigationData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field as keyof ValidationErrors]: undefined
      }));
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

  const resetForm = () => {
    const initialData = {
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
      supplies: [],
      observations: ""
    };

    if (fumigationDetails) {
      initialData.fumigationId = fumigationDetails.lot.id.toString();
      initialData.registrationNumber = fumigationDetails.lot.lotNumber;
      initialData.company = fumigationDetails.company.businessName;
      initialData.location = fumigationDetails.company.address;
      initialData.supervisor = fumigationDetails.representative;
      initialData.lotDetails = {
        lotNumber: fumigationDetails.lot.lotNumber,
        tons: fumigationDetails.lot.tons.toString(),
        quality: fumigationDetails.lot.quality,
        sacks: fumigationDetails.lot.sacks.toString(),
        destination: fumigationDetails.lot.portDestination
      };
    }

    setFumigationData(initialData);
    setValidationErrors({});
  };

  return {
    fumigationData,
    setFumigationData,
    validateFumigationForm,
    validationErrors,
    clearValidationErrors,
    updateField,
    addToArray,
    removeFromArray,
    resetForm
  };
};