// components/TableReservations.jsx
import { FaFileAlt, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FumigationLot } from '@/hooks/useMyFumigationApplications';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc' | null;
}

interface TableReservationsProps {
  readonly title: string;
  readonly data: readonly { 
    codigo: string; 
    estado: string; 
    fechaAprox: string; 
    toneladas: number;
    hasRejectedOrFailed?: boolean;
    lots?: readonly FumigationLot[];
  }[];
  readonly onSort?: (sortConfig: SortConfig) => void;
  readonly onPageChange?: (page: number) => void;
  readonly onPageSizeChange?: (pageSize: number) => void;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly pageSize?: number;
  readonly totalElements?: number;
}

function TableReservations({ 
  title, 
  data, 
  onSort,
  onPageChange,
  onPageSizeChange,
  currentPage = 0,
  totalPages = 1,
  pageSize = 3,
  totalElements = 0
}: TableReservationsProps) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'codigo', direction: 'asc' });
  const [localCurrentPage, setLocalCurrentPage] = useState(0);
  const [localPageSize, setLocalPageSize] = useState(pageSize);

  // Unificar todos los lotes en un solo array plano
  const allLots: FumigationLot[] = data.flatMap(reserva => reserva.lots ?? []);
  
  // Calcular paginación local para los lotes
  const totalLots = allLots.length;
  const startIndex = localCurrentPage * localPageSize;
  const endIndex = startIndex + localPageSize;
  const currentLots = allLots.slice(startIndex, endIndex);
  const totalLotPages = Math.max(1, Math.ceil(totalLots / localPageSize));

  const handleLotDocumentosClick = (lotId: number) => {
    console.log('Navegando a documentos del lote:', lotId);
    navigate(`/client/documentos/lote/${lotId}`);
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTimeStr;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'Pendiente',
      'APPROVED': 'Aprobado',
      'REJECTED': 'Rechazado',
      'FAILED': 'Falló',
      'FINISHED': 'Finalizado'
    };
    return statusLabels[status] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'FINISHED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLotProblems = (lot: FumigationLot) => {
    return lot.status === 'REJECTED' || lot.status === 'FAILED';
  };

  const handleSort = (key: string) => {
    if (key === 'acciones') return; // No permitir ordenar por acciones

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  };

  const getSortIcon = (column: string) => {
    if (column === 'acciones') return null;
    
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? 
        <FaSortUp className="inline ml-1" /> : 
        <FaSortDown className="inline ml-1" />;
    }
    return <FaSort className="inline ml-1 opacity-50" />;
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value);
    setLocalPageSize(newPageSize);
    setLocalCurrentPage(0); // Resetear a la primera página cuando cambia el tamaño
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalLotPages) {
      setLocalCurrentPage(newPage);
    }
  };

  const getColumnName = (key: string) => {
    const columnNames: { [key: string]: string } = {
      codigo: 'Código',
      estado: 'Estado',
      fechaAprox: 'Fecha aproximada',
      toneladas: 'Toneladas',
      acciones: 'Acciones'
    };
    return columnNames[key] || key;
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#003595]">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mostrar:</span>
          <select 
            value={localPageSize} 
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="text-sm text-gray-600">registros</span>
        </div>
      </div>

      <div className="overflow-auto max-h-[400px] rounded border border-blue-700">
        <table className="w-full text-left">
          <thead className="bg-white text-[#003595] border-b">
            <tr>
              <th className="p-2">Lote</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Toneladas</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentLots.length > 0 ? (
              currentLots.map((lot) => (
                <tr key={lot.id} className="border-b hover:bg-blue-50">
                  <td className="p-2 pl-4 text-sm text-gray-600">
                    <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {lot.lotNumber}
                  </td>
                  <td className="p-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(lot.status)}`}>
                      {getStatusLabel(lot.status)}
                    </span>
                  </td>
                  <td className="p-2 text-sm">{formatDateTime(lot.dateTime)}</td>
                  <td className="p-2 text-sm">{lot.ton}</td>
                  <td className="p-2 flex flex-wrap gap-2 items-center">
                    <button 
                      onClick={() => handleLotDocumentosClick(lot.id)}
                      className="border border-gray-400 text-gray-600 px-2 py-1 rounded text-xs flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <FaFileAlt className="mr-1 text-xs" /> Documentos
                    </button>
                    {getLotProblems(lot) && (
                      <div className="flex items-center text-red-600 text-xs">
                        <FaExclamationTriangle className="mr-1" />
                        <span>Revisar documentos</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No hay lotes disponibles en esta página
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {totalLots > 0 ? (
            <>Mostrando {startIndex + 1} a {Math.min(endIndex, totalLots)} de {totalLots} lotes</>
          ) : (
            <>No hay lotes disponibles</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(localCurrentPage - 1)}
            disabled={localCurrentPage === 0 || totalLots === 0}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            Página {totalLots > 0 ? localCurrentPage + 1 : 0} de {totalLots > 0 ? totalLotPages : 0}
          </span>
          <button 
            onClick={() => handlePageChange(localCurrentPage + 1)}
            disabled={localCurrentPage >= totalLotPages - 1 || totalLots === 0}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  )
}

export default TableReservations