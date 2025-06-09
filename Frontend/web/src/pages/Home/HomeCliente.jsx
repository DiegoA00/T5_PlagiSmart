import React, { useState } from 'react';
import ReservationsList from './Components/ReservationsList';
import NuevaReservaButton from './Components/NuevaReservaButton';
import NewReservationForm from './Components/NewReservationForm';

const reservasProximas = [
  { id: '0000001', day: 'LUNES', date: 18, month: 'Noviembre', time: '09:00', period: 'AM', status: 'Próxima', documents: [] },
];

const reservasEnCurso = [
  { id: '0000002', day: 'LUNES', date: 11, month: 'Noviembre', time: '13:00', period: 'PM', status: 'En Curso', documents: [] },
];

function HomeClient() {
  const [showForm, setShowForm] = useState(false);

  const handleNewReservationClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="flex flex-col">
        <div className='flex w-full'>
          <div className='h-screen w-1/12 min-w-[120px] bg-blueAnecacao pr-2'>
          </div>
          <section className='h-full w-11/12 pt-2 px-2'>
            <div className='flex justify-end place-content-center'>
              <NuevaReservaButton onClick={handleNewReservationClick} />
            </div>
            <ReservationsList title="Próximas" reservations={reservasProximas} />
            <ReservationsList title="En Curso" reservations={reservasEnCurso} />
          </section>
        </div>

      {showForm && <NewReservationForm onClose={handleCloseForm} />}
    </div>
  );
}

export default HomeClient;
