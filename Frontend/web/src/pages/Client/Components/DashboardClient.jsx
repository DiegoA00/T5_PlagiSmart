import TableReservations from "./TablaReservations";

const reservas = [
  { fecha: "000001", servicio: "Fumigación Cacao", fechaAprox: "14/10/2024", toneladas: 100 },
  { fecha: "000002", servicio: "Fumigación Cacao", fechaAprox: "14/10/2024", toneladas: 100 },
  { fecha: "000003", servicio: "Fumigación Cacao", fechaAprox: "14/10/2024", toneladas: 100 },
];

export default function Dashboard() {
  return (
    <div className="px-6">
      <p className="text-[#003595]">
        Gestion de Reservas
      </p>
      <div className="flex justify-end mb-6">
        <button className="bg-[#003595] text-white px-4 py-2 rounded-lg font-bold shadow-md">
          + Nueva Reserva
        </button>
      </div>

      <TableReservations title="Proximas" data={reservas} editableIndex={-1} />
      <TableReservations title="En Curso" data={reservas} editableIndex={1} />
      <TableReservations title="Finalizadas" data={reservas} editableIndex={-1} />
    </div>
  );
}
