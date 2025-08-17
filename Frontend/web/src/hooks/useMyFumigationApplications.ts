import { useState, useEffect, useCallback } from 'react';
import { fumigationService, ClientFumigationApplication } from '@/services/fumigationService';

export interface ApplicationTableData {
  codigo: string;
  estado: string;
  fechaAprox: string;
  toneladas: number;
  hasRejectedOrFailed?: boolean;
  lots?: FumigationLot[];
}

export interface FumigationLot {
  id: number;
  lotNumber: string;
  ton: number;
  portDestination: string;
  sacks: number;
  quality: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FAILED' | 'FINISHED';
  message: string;
  dateTime: string;
}

export interface CategorizedApplications {
  pendientes: ApplicationTableData[];
  enCurso: ApplicationTableData[];
  finalizadas: ApplicationTableData[];
}

const categorizeApplications = (applications: ClientFumigationApplication[]): CategorizedApplications => {
  const pendientes: ApplicationTableData[] = [];
  const enCurso: ApplicationTableData[] = [];
  const finalizadas: ApplicationTableData[] = [];

  applications.forEach(app => {
    const fumigationStatuses = app.fumigations.map(f => f.status);
    
    // Verificar si tiene estados rechazados o fallidos
    const hasRejectedOrFailed = fumigationStatuses.some(status => 
      status === 'REJECTED' || status === 'FAILED'
    );

    const applicationData: ApplicationTableData = {
      codigo: app.id.toString(),
      estado: '', // Por ahora vacío según los requisitos
      fechaAprox: app.earlyDate,
      toneladas: app.totalTons,
      hasRejectedOrFailed,
      lots: app.fumigations.map(fumigation => ({
        id: fumigation.id,
        lotNumber: fumigation.lotNumber,
        ton: fumigation.ton,
        portDestination: fumigation.portDestination,
        sacks: fumigation.sacks,
        quality: fumigation.quality,
        status: fumigation.status,
        message: fumigation.message,
        dateTime: fumigation.dateTime
      }))
    };

    // Lógica de categorización según los estados de las fumigaciones
    if (fumigationStatuses.every(status => status === 'FINISHED')) {
      // Todas las fumigaciones están finalizadas
      finalizadas.push(applicationData);
    } else if (fumigationStatuses.every(status => status === 'PENDING') || 
               fumigationStatuses.some(status => status === 'REJECTED')) {
      // Todas pendientes o al menos una rechazada
      pendientes.push(applicationData);
    } else if (fumigationStatuses.every(status => status === 'APPROVED') || 
               fumigationStatuses.some(status => status === 'FAILED')) {
      // Todas aprobadas o al menos una falló
      enCurso.push(applicationData);
    } else {
      // Estados mixtos - por defecto van a pendientes
      pendientes.push(applicationData);
    }
  });

  return { pendientes, enCurso, finalizadas };
};

export interface TablePaginationState {
  page: number;
  size: number;
  sort: string[];
}

export interface TablesPaginationStates {
  pendientes: TablePaginationState;
  enCurso: TablePaginationState;
  finalizadas: TablePaginationState;
}

export const useMyFumigationApplications = (initialPageSize: number = 3) => {
  const [applications, setApplications] = useState<CategorizedApplications>({
    pendientes: [],
    enCurso: [],
    finalizadas: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allApplications, setAllApplications] = useState<ClientFumigationApplication[]>([]);
  
  // Estados de paginación separados para cada tabla
  const [tableStates, setTableStates] = useState<TablesPaginationStates>({
    pendientes: { page: 0, size: initialPageSize, sort: ['id'] },
    enCurso: { page: 0, size: initialPageSize, sort: ['id'] },
    finalizadas: { page: 0, size: initialPageSize, sort: ['id'] }
  });

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtenemos todas las aplicaciones sin paginación desde el servidor
      const response = await fumigationService.getMyApplications({
        page: 0,
        size: 1000, // Un número grande para obtener todas las aplicaciones
        sort: ['id']
      });
      
      const allApps = response.content;
      setAllApplications(allApps);
      
      // Categorizamos todas las aplicaciones
      const categorized = categorizeApplications(allApps);
      
      // Aplicamos paginación local para cada tabla
      const paginatedCategories: CategorizedApplications = {
        pendientes: paginateArray(categorized.pendientes, tableStates.pendientes),
        enCurso: paginateArray(categorized.enCurso, tableStates.enCurso),
        finalizadas: paginateArray(categorized.finalizadas, tableStates.finalizadas)
      };
      
      setApplications(paginatedCategories);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las aplicaciones');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  }, [tableStates]);

  const paginateArray = (array: ApplicationTableData[], state: TablePaginationState): ApplicationTableData[] => {
    const startIndex = state.page * state.size;
    const endIndex = startIndex + state.size;
    return array.slice(startIndex, endIndex);
  };

  const getTotalPages = (category: keyof CategorizedApplications): number => {
    const categorized = categorizeApplications(allApplications);
    return Math.ceil(categorized[category].length / tableStates[category].size);
  };

  const getTotalElements = (category: keyof CategorizedApplications): number => {
    const categorized = categorizeApplications(allApplications);
    return categorized[category].length;
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const refetch = useCallback(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handlePageChange = useCallback((category: keyof CategorizedApplications, page: number) => {
    setTableStates(prev => ({
      ...prev,
      [category]: { ...prev[category], page }
    }));
  }, []);

  const handlePageSizeChange = useCallback((category: keyof CategorizedApplications, size: number) => {
    setTableStates(prev => ({
      ...prev,
      [category]: { ...prev[category], page: 0, size }
    }));
  }, []);

  const handleSort = useCallback((category: keyof CategorizedApplications, sortKey: string, direction: 'asc' | 'desc') => {
    const sortParam = direction === 'desc' ? `${sortKey},desc` : sortKey;
    setTableStates(prev => ({
      ...prev,
      [category]: { ...prev[category], page: 0, sort: [sortParam] }
    }));
  }, []);

  // Actualizar las aplicaciones cuando cambien los estados de las tablas
  useEffect(() => {
    if (allApplications.length > 0) {
      const categorized = categorizeApplications(allApplications);
      
      const paginatedCategories: CategorizedApplications = {
        pendientes: paginateArray(categorized.pendientes, tableStates.pendientes),
        enCurso: paginateArray(categorized.enCurso, tableStates.enCurso),
        finalizadas: paginateArray(categorized.finalizadas, tableStates.finalizadas)
      };
      
      setApplications(paginatedCategories);
    }
  }, [tableStates, allApplications]);

  return {
    applications,
    loading,
    error,
    refetch,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    getTotalPages,
    getTotalElements,
    tableStates
  };
};
