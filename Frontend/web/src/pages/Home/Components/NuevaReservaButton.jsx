import React from 'react';

function NuevaReservaButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-20 right-10 bg-blueAnecacao text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      + Nueva Reserva
    </button>
  );
}

export default NuevaReservaButton;
