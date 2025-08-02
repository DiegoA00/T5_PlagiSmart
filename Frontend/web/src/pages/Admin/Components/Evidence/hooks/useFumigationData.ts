import { useState } from "react";
import { toast } from "sonner";

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

export interface FumigationData {
  // General Info
  fumigationId: string;
  registrationNumber: string;
  company: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  
  // Dimensions
  totalArea: string;
  treatedArea: string;
  dimensions: Dimensions;
  
  // Environmental
  environmentalConditions: EnvironmentalConditions;
  
  // Personnel
  selectedTechnician: string;
  technicians: Array<{
    id: number;
    name: string;
    role: string;
  }>;
  
  // Safety
  hazards: Hazards;
  
  // Supplies
  supplies: Supply[];
  
  // Observations
  observations: string;
}

export const useFumigationData = (initialData?: any) => {
  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    // Asegurar que usamos la fecha local, no UTC
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [fumigationData, setFumigationData] = useState<FumigationData>({
    fumigationId: initialData?.id?.toString() || "",
    registrationNumber: initialData?.registrationNumber || "",
    company: initialData?.lot?.client?.businessName || "",
    location: initialData?.lot?.location || "",
    date: getCurrentDate(), // Usar fecha actual siempre
    startTime: "",
    endTime: "",
    totalArea: initialData?.lot?.area?.toString() || "",
    treatedArea: "",
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
      totalArea: "",
      treatedArea: "",
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
  };

  const validateFumigationForm = (): boolean => {
    console.log("Validando formulario:", fumigationData);
    
    // Validar ubicación
    if (!fumigationData.location || fumigationData.location.trim() === "") {
      toast.error("La ubicación es requerida");
      return false;
    }
    
    // Validar horarios
    if (!fumigationData.startTime || fumigationData.startTime.trim() === "") {
      toast.error("La hora de inicio es requerida");
      return false;
    }
    
    if (!fumigationData.endTime || fumigationData.endTime.trim() === "") {
      toast.error("La hora de finalización es requerida");
      return false;
    }

    // Validar que la hora de fin sea posterior a la hora de inicio
    if (fumigationData.startTime >= fumigationData.endTime) {
      toast.error("La hora de finalización debe ser posterior a la hora de inicio");
      return false;
    }
    
    // Validar que haya al menos un técnico
    if (fumigationData.technicians.length === 0) {
      toast.error("Se requiere al menos un técnico asignado");
      return false;
    }
    
    // Validar dimensiones
    const { height, width, length } = fumigationData.dimensions;
    if (!height || !width || !length || height.trim() === "" || width.trim() === "" || length.trim() === "") {
      toast.error("Todas las dimensiones son requeridas (altura, ancho y largo)");
      return false;
    }
    
    const heightNum = parseFloat(height);
    const widthNum = parseFloat(width);
    const lengthNum = parseFloat(length);
    
    if (isNaN(heightNum) || isNaN(widthNum) || isNaN(lengthNum)) {
      toast.error("Las dimensiones deben ser números válidos");
      return false;
    }
    
    if (heightNum <= 0 || widthNum <= 0 || lengthNum <= 0) {
      toast.error("Las dimensiones deben ser mayores a 0");
      return false;
    }
    
    // Validar condiciones ambientales
    const { temperature, humidity } = fumigationData.environmentalConditions;
    if (!temperature || !humidity || temperature.trim() === "" || humidity.trim() === "") {
      toast.error("La temperatura y humedad son requeridas");
      return false;
    }
    
    const tempNum = parseFloat(temperature);
    const humidityNum = parseFloat(humidity);
    
    // Solo validar que la temperatura sea un número válido (sin rango)
    if (isNaN(tempNum)) {
      toast.error("La temperatura debe ser un número válido");
      return false;
    }
    
    // Validar humedad dentro del rango 0-100%
    if (isNaN(humidityNum) || humidityNum < 0 || humidityNum > 100) {
      toast.error("La humedad debe ser un número entre 0% y 100%");
      return false;
    }
    
    // Validar suministros
    if (fumigationData.supplies.length === 0) {
      toast.error("Se requiere al menos un suministro");
      return false;
    }
    
    for (let i = 0; i < fumigationData.supplies.length; i++) {
      const supply = fumigationData.supplies[i];
      
      // Validar campos requeridos
      if (!supply.name || supply.name.trim() === "") {
        toast.error(`El nombre del producto es requerido en el suministro ${i + 1}`);
        return false;
      }
      
      if (!supply.quantity || supply.quantity.trim() === "") {
        toast.error(`La cantidad es requerida en el suministro ${i + 1}`);
        return false;
      }
      
      if (!supply.dosage || supply.dosage.trim() === "") {
        toast.error(`La dosis es requerida en el suministro ${i + 1}`);
        return false;
      }
      
      if (!supply.kindOfSupply || supply.kindOfSupply.trim() === "") {
        toast.error(`El tipo de suministro es requerido en el suministro ${i + 1}`);
        return false;
      }
      
      // Validar que la cantidad sea un número válido y positivo
      const quantityNum = parseFloat(supply.quantity);
      if (isNaN(quantityNum) || quantityNum <= 0) {
        toast.error(`La cantidad debe ser un número positivo en el suministro ${i + 1}`);
        return false;
      }
      
      // Validar número de cintas (opcional, pero si está presente debe ser válido)
      if (supply.numberOfStrips && supply.numberOfStrips.trim() !== "") {
        const stripsNum = parseFloat(supply.numberOfStrips);
        if (isNaN(stripsNum) || stripsNum < 0) {
          toast.error(`El número de cintas debe ser un número no negativo en el suministro ${i + 1}`);
          return false;
        }
      }
    }
    
    console.log("Formulario válido - sin errores de validación");
    return true;
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

  return {
    fumigationData,
    setFumigationData,
    resetForm,
    validateFumigationForm,
    updateField,
    addToArray,
    removeFromArray
  };
};