import React from 'react';
import ReservationCard from './ReservationCard';

function ReservationsList({ title, reservations }) {
  return (
    <section className="mb-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="space-y-4">
        {reservations.map(reservation => (
          <ReservationCard key={reservation.id} {...reservation} />
        ))}
      </div>
    </section>
  );
}

export default ReservationsList;
