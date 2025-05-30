import React from 'react';
import { FaRegFileAlt } from "react-icons/fa";

function ReservationDocumentsButton({ documents }) {
  return (
    <button className="flex items-center space-x-2 bg-gray-200 sm:mr-5 px-3 py-1 rounded hover:bg-gray-300 max-sm:text-[14px] max-sm:pr-2">
      <FaRegFileAlt />
      <span>Documentos</span>
    </button>
  );
}

export default ReservationDocumentsButton;
