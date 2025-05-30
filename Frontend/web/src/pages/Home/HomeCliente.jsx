import React from 'react';
import ReservationsList from './Components/ReservationsList';
import NuevaReservaButton from './Components/NuevaReservaButton';

const reservasProximas = [
  { id: '0000001', day: 'LUNES', date: 18, month: 'Noviembre', time: '09:00', period: 'AM', status: 'Próxima', documents: [] },
];

const reservasEnCurso = [
  { id: '0000002', day: 'LUNES', date: 11, month: 'Noviembre', time: '13:00', period: 'PM', status: 'En Curso', documents: [] },
];

function HomeClient() {
  return (
    <div className="flex flex-col">
      <NuevaReservaButton onClick={() => alert('Crear nueva reserva')} />
        <div className='flex w-full'>
          <div className='h-screen w-1/12 min-w-[120px] bg-blueAnecacao pr-2'>
          </div>
          <section className='h-full w-11/12 pt-10 px-2'>
            <ReservationsList title="Próximas" reservations={reservasProximas} />
            <ReservationsList title="En Curso" reservations={reservasEnCurso} />
          </section>
        </div>

    </div>
  );
}

export default HomeClient;
