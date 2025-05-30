import React from 'react';
import ReservationStatusBadge from './ReservationStatusBadge';
import ReservationDocumentsButton from './ReservationDocumentsButton';

function ReservationCard({ day, date, month, time, period, status, documents, id }) {
  return (
    <div className="relative flex items-center justify-between bg-gray-100 p-4 rounded shadow">
      <div>
        <div className="font-bold">{day}</div>
        <div>{date} {month}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-mono max-sm:text-lg">{time}</div>
        <div className="text-xs">{period}</div>
      </div>
      <ReservationDocumentsButton documents={documents}/>
      <div className="absolute right-5 max-sm:right-2 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-90 text-xs text-gray-400 select-none">
        #{id}
      </div>
    </div>
  );
}

export default ReservationCard;
