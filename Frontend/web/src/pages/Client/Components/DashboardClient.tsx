import TableReservations, { SortConfig } from "./TableReservations";
import NewReservationForm from "./NewReservationForm";
import { useState } from 'react';
import { useMyFumigationApplications } from '@/hooks/useMyFumigationApplications';

type TableCategory = 'pendientes' | 'enCurso' | 'finalizadas';

interface DashboardClientProps {
  readonly showHeader?: boolean;
  readonly showNewButton?: boolean;
  readonly tablesToShow?: readonly string[];
  readonly title?: string;
}

function DashboardClient({ 
  showHeader = true, 
  showNewButton = true, 
  tablesToShow = ['pendientes', 'enCurso', 'finalizadas'],
  title = "Gestión de Reservas"
}: DashboardClientProps) {
  const [showForm, setShowForm] = useState(false);
  const { 
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
  } = useMyFumigationApplications();

  const handleNewReservationClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    // Refrescar los datos después de crear una nueva aplicación
    refetch();
  };

  const handleTableSort = (category: TableCategory) => (sortConfig: SortConfig) => {
    if (sortConfig.direction) {
      handleSort(category, sortConfig.key, sortConfig.direction);
    }
  };

  const handleTablePageChange = (category: TableCategory) => (page: number) => {
    handlePageChange(category, page);
  };

  const handleTablePageSizeChange = (category: TableCategory) => (pageSize: number) => {
    handlePageSizeChange(category, pageSize);
  };

  if (loading) {
    return (
      <div className="pt-10">
        <div className="px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-[#003595] text-lg">Cargando aplicaciones...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-10">
        <div className="px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600 text-lg">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10">
      <div className="px-6">
        {showHeader && (
          <p className="text-2xl text-center font-bold text-[#003595] mb-4">
            {title}
          </p>
        )}

        {showNewButton && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleNewReservationClick}
              className="bg-[#003595] text-white px-4 py-2 rounded-lg font-bold shadow-md">
              + Nueva Reserva
            </button>
          </div>
        )}

        {tablesToShow.includes('pendientes') && (
          <TableReservations 
            title="Pendientes" 
            data={applications.pendientes}
            onSort={handleTableSort('pendientes')}
            onPageChange={handleTablePageChange('pendientes')}
            onPageSizeChange={handleTablePageSizeChange('pendientes')}
            currentPage={tableStates.pendientes.page}
            totalPages={getTotalPages('pendientes')}
            pageSize={tableStates.pendientes.size}
            totalElements={getTotalElements('pendientes')}
          />
        )}
        {tablesToShow.includes('enCurso') && (
          <TableReservations 
            title="En Curso" 
            data={applications.enCurso}
            onSort={handleTableSort('enCurso')}
            onPageChange={handleTablePageChange('enCurso')}
            onPageSizeChange={handleTablePageSizeChange('enCurso')}
            currentPage={tableStates.enCurso.page}
            totalPages={getTotalPages('enCurso')}
            pageSize={tableStates.enCurso.size}
            totalElements={getTotalElements('enCurso')}
          />
        )}
        {tablesToShow.includes('finalizadas') && (
          <TableReservations 
            title="Finalizadas" 
            data={applications.finalizadas}
            onSort={handleTableSort('finalizadas')}
            onPageChange={handleTablePageChange('finalizadas')}
            onPageSizeChange={handleTablePageSizeChange('finalizadas')}
            currentPage={tableStates.finalizadas.page}
            totalPages={getTotalPages('finalizadas')}
            pageSize={tableStates.finalizadas.size}
            totalElements={getTotalElements('finalizadas')}
          />
        )}

        {showForm && <NewReservationForm onClose={handleCloseForm} />}
      </div>
    </div>
  ) 
}

export default DashboardClient;