import TableReservations from "./TableReservations";
import NewReservationForm from "./NewReservationForm";
import { useState } from 'react';

interface Reserva {
  codigo: string;
  servicio: string;
  fechaAprox: string;
  toneladas: number;
}

interface DashboardClientProps {
  readonly showHeader?: boolean;
  readonly showNewButton?: boolean;
  readonly tablesToShow?: readonly string[];
  readonly title?: string;
  readonly data?: readonly Reserva[];
}

const reservas: Reserva[] = [
  { codigo: "000001", servicio: "Fumigación Cacao", fechaAprox: "14/10/2024", toneladas: 100 },
  { codigo: "000002", servicio: "Fumigación Cacao", fechaAprox: "14/10/2024", toneladas: 100 },
  { codigo: "000003", servicio: "Fumigación Cacao", fechaAprox: "14/10/2024", toneladas: 100 },
];

function DashboardClient({ 
  showHeader = true, 
  showNewButton = true, 
  tablesToShow = ['pendientes', 'enCurso', 'finalizadas'],
  title = "Gestión de Reservas",
  data = reservas 
}: DashboardClientProps) {
  const [showForm, setShowForm] = useState(false);

  const handleNewReservationClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

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
          <TableReservations title="Pendientes" data={data} editableIndex={-1} />
        )}
        {tablesToShow.includes('enCurso') && (
          <TableReservations title="En Curso" data={data} editableIndex={1} />
        )}
        {tablesToShow.includes('finalizadas') && (
          <TableReservations title="Finalizadas" data={data} editableIndex={-1} />
        )}

        {showForm && <NewReservationForm onClose={handleCloseForm} />}
      </div>
    </div>
  ) 
}

export default DashboardClient;