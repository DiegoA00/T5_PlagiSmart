import { useState, useEffect } from "react";
import { FumigationDetailResponse } from "@/types/request";

export interface LotDetails {
  ppmFosfina: string;
  fumigationTime: string;
  stripsState: string;
  lotNumber: string;
  tons: string;
  quality: string;
  sacks: string;
  destination: string;
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
  otherDanger?: boolean;
}

export interface Supply {
  name: string;
  quantity: string;
  dosage: string;
  kindOfSupply: string;
  numberOfStrips: string;
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
  
  technicianSignature: string;
  clientSignature: string;
}

export interface ValidationErrors {
  fumigationTime?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  timeRange?: string;
  supervisor?: string;
  technicians?: string;
  supplies?: string;
  height?: string;
  width?: string;
  length?: string;
  temperature?: string;
  humidity?: string;
  observations?: string;
  ppmFosfina?: string;
  dimensions?: string;
}

const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useFumigationEvidence = (fumigationDetails: FumigationDetailResponse | null) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
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
      destination: "",
      ppmFosfina: "",
      fumigationTime: "",
      stripsState: ""
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
      hitDanger: false,
      otherDanger: false
    },
    supplies: [],
    observations: "",
    technicianSignature: "",
    clientSignature: ""
  });

  useEffect(() => {
    if (fumigationDetails?.lot?.id && fumigationDetails?.company) {
      setFumigationData(prev => ({
        ...prev,
        fumigationId: fumigationDetails.lot.id.toString(),
        registrationNumber: fumigationDetails.lot.lotNumber || "",
        company: fumigationDetails.company.businessName || "",
        location: fumigationDetails.company.address || "",
        supervisor: "",
        lotDetails: {
          lotNumber: fumigationDetails.lot.lotNumber || "",
          tons: fumigationDetails.lot.tons?.toString() || "",
          quality: fumigationDetails.lot.quality || "",
          sacks: fumigationDetails.lot.sacks?.toString() || "",
          destination: fumigationDetails.lot.portDestination || "",
          ppmFosfina: "",
          fumigationTime: "",
          stripsState: ""
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
    
    if (fumigationData.startTime && fumigationData.endTime) {
      const startTime = new Date(`2000-01-01T${fumigationData.startTime}`);
      const endTime = new Date(`2000-01-01T${fumigationData.endTime}`);
      
      if (endTime <= startTime) {
        errors.timeRange = "La hora de finalización debe ser posterior a la hora de inicio";
      }
    }
    
    if (!fumigationData.supervisor || fumigationData.supervisor.trim() === "") {
      errors.supervisor = "El supervisor es requerido";
    }
    
    if (fumigationData.technicians.length === 0) {
      errors.technicians = "Se requiere al menos un técnico";
    }
    
    if (fumigationData.supplies.length === 0) {
      errors.supplies = "Se requiere al menos un insumo";
    }
    
    if (!fumigationData.dimensions.height || fumigationData.dimensions.height.trim() === "") {
      errors.height = "La altura es requerida";
    }
    
    if (!fumigationData.dimensions.width || fumigationData.dimensions.width.trim() === "") {
      errors.width = "El ancho es requerido";
    }
    
    if (!fumigationData.dimensions.length || fumigationData.dimensions.length.trim() === "") {
      errors.length = "La longitud es requerida";
    }
    
    if (!fumigationData.environmentalConditions.temperature || fumigationData.environmentalConditions.temperature.trim() === "") {
      errors.temperature = "La temperatura es requerida";
    }
    
    if (!fumigationData.environmentalConditions.humidity || fumigationData.environmentalConditions.humidity.trim() === "") {
      errors.humidity = "La humedad es requerida";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const updateField = (field: keyof FumigationData, value: any) => {
    setFumigationData(prev => ({
      ...prev,
      [field]: value
    }));
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
        destination: "",
        ppmFosfina: "",
        fumigationTime: "",
        stripsState: ""
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
        hitDanger: false,
        otherDanger: false
      },
      supplies: [],
      observations: "",
      technicianSignature: "",
      clientSignature: ""
    };

    if (fumigationDetails?.lot?.id && fumigationDetails?.company) {
      initialData.fumigationId = fumigationDetails.lot.id.toString();
      initialData.registrationNumber = fumigationDetails.lot.lotNumber || "";
      initialData.company = fumigationDetails.company.businessName || "";
      initialData.location = fumigationDetails.company.address || "";
      initialData.lotDetails = {
        lotNumber: fumigationDetails.lot.lotNumber || "",
        tons: fumigationDetails.lot.tons?.toString() || "",
        quality: fumigationDetails.lot.quality || "",
        sacks: fumigationDetails.lot.sacks?.toString() || "",
        destination: fumigationDetails.lot.portDestination || "",
        ppmFosfina: "",
        fumigationTime: "",
        stripsState: ""
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
