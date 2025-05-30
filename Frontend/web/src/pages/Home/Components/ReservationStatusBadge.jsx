import React from 'react';

function ReservationStatusBadge({ status }) {
  const color = status === 'En Curso' ? 'bg-blue-500' : 'bg-gray-300';
  return (
    <span className={`px-3 py-1 rounded text-white text-xs ${color}`}>
      {status}
    </span>
  );
}

export default ReservationStatusBadge;
