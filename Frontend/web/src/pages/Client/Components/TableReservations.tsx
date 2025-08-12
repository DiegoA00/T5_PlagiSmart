// components/TableReservations.jsx
import { FaFileAlt, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

  const handleDocumentosClick = (codigo: string) => {
    navigate(`/client/documentos/${codigo}`);
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
    onPageSizeChange?.(newPageSize);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange?.(newPage);
    }
  };

  const getColumnName = (key: string) => {
    const columnNames: { [key: string]: string } = {
      codigo: 'Código',
      estado: 'Servicio',
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
            value={pageSize} 
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
              <th className="p-2"><input type="checkbox" /></th>
              {['codigo', 'estado', 'fechaAprox', 'toneladas', 'acciones'].map((column) => (
                <th 
                  key={column}
                  className={`p-2 ${column !== 'acciones' ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                  onClick={() => handleSort(column)}
                >
                  {getColumnName(column)}
                  {getSortIcon(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((reserva, index) => (
              <tr key={reserva.codigo || index} className="border-b hover:bg-blue-50">
                <td className="p-2"><input type="checkbox" /></td>
                <td className="p-2">{reserva.codigo}</td>
                <td className="p-2">{reserva.estado}</td>
                <td className="p-2">{reserva.fechaAprox}</td>
                <td className="p-2">{reserva.toneladas}</td>
                <td className="p-2 flex flex-wrap gap-2 items-center">
                  <button 
                    onClick={() => handleDocumentosClick(reserva.codigo)}
                    className="border border-[#003595] text-[#003595] px-3 py-1 rounded flex items-center hover:bg-[#003595] hover:text-white transition-colors"
                  >
                    <FaFileAlt className="mr-2" /> Documentos
                  </button>
                  {reserva.hasRejectedOrFailed && (
                    <div className="flex items-center text-red-600 text-sm">
                      <FaExclamationTriangle className="mr-1" />
                      <span>Revisar documentos</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Mostrando {currentPage * pageSize + 1} a {Math.min((currentPage + 1) * pageSize, totalElements)} de {totalElements} registros
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          
          <span className="px-3 py-1">
            Página {currentPage + 1} de {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
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