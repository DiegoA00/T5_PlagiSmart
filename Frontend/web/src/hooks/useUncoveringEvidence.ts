import { useState, useEffect } from 'react';
import { FumigationDetailResponse } from '@/types/request';

export interface CleanupData {
  date: string;
  startTime: string;
  endTime: string;
  technicians: Array<{ id: number; firstName: string; lastName: string }>;
  lotDescription: {
    stripsState: string;
    fumigationTime: number;
    ppmFosfina: number;
  };
  industrialSafetyConditions: {
    electricDanger: boolean;
    fallingDanger: boolean;
    hitDanger: boolean;
    otherDanger: boolean;
  };
}

export interface CleanupValidationErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
  technicians?: string;
  stripsState?: string;
  fumigationTime?: string;
  ppmFosfina?: string;
}

export const useUncoveringEvidence = (fumigationDetails: FumigationDetailResponse | null) => {
  const [cleanupData, setCleanupData] = useState<CleanupData>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    technicians: [],
    lotDescription: {
      stripsState: '',
      fumigationTime: 0,
      ppmFosfina: 0,
    },
    industrialSafetyConditions: {
      electricDanger: false,
      fallingDanger: false,
      hitDanger: false,
      otherDanger: false,
    },
  });

  const [validationErrors, setValidationErrors] = useState<CleanupValidationErrors>({});

  const updateField = (field: keyof CleanupData, value: any) => {
    setCleanupData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (validationErrors[field as keyof CleanupValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const updateLotDescription = (field: keyof CleanupData['lotDescription'], value: any) => {
    setCleanupData(prev => ({
      ...prev,
      lotDescription: {
        ...prev.lotDescription,
        [field]: value
      }
    }));
  };

  const updateSafetyConditions = (field: keyof CleanupData['industrialSafetyConditions'], value: boolean) => {
    setCleanupData(prev => ({
      ...prev,
      industrialSafetyConditions: {
        ...prev.industrialSafetyConditions,
        [field]: value
      }
    }));
  };

  const addTechnician = (technician: { id: number; firstName: string; lastName: string }) => {
    setCleanupData(prev => ({
      ...prev,
      technicians: [...prev.technicians, technician]
    }));
  };

  const removeTechnician = (index: number) => {
    setCleanupData(prev => ({
      ...prev,
      technicians: prev.technicians.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const errors: CleanupValidationErrors = {};

    if (!cleanupData.date) {
      errors.date = 'La fecha es requerida';
    }

    if (!cleanupData.startTime) {
      errors.startTime = 'La hora de inicio es requerida';
    }

    if (!cleanupData.endTime) {
      errors.endTime = 'La hora de fin es requerida';
    }

    if (cleanupData.technicians.length === 0) {
      errors.technicians = 'Debe seleccionar al menos un técnico';
    }

    if (!cleanupData.lotDescription.stripsState.trim()) {
      errors.stripsState = 'El estado de cintas es requerido';
    }

    if (cleanupData.lotDescription.fumigationTime <= 0) {
      errors.fumigationTime = 'El tiempo de fumigación debe ser mayor a 0';
    }

    if (cleanupData.lotDescription.ppmFosfina <= 0) {
      errors.ppmFosfina = 'El PPM fosfina debe ser mayor a 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const resetForm = () => {
    setCleanupData({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      technicians: [],
      lotDescription: {
        stripsState: '',
        fumigationTime: 0,
        ppmFosfina: 0,
      },
      industrialSafetyConditions: {
        electricDanger: false,
        fallingDanger: false,
        hitDanger: false,
        otherDanger: false,
      },
    });
    setValidationErrors({});
  };

  return {
    cleanupData,
    setCleanupData,
    validationErrors,
    updateField,
    updateLotDescription,
    updateSafetyConditions,
    addTechnician,
    removeTechnician,
    validateForm,
    clearValidationErrors,
    resetForm,
  };
};