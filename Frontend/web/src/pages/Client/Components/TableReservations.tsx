// components/TableReservations.jsx
import { FaFileAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

interface TableReservationsProps {
  readonly title: string;
  readonly data: readonly { codigo: string; servicio: string; fechaAprox: string; toneladas: number }[];
  readonly editableIndex: number;
}

function TableReservations({ title, data, editableIndex }: TableReservationsProps) {
  const navigate = useNavigate();

  const handleDocumentosClick = (codigo: string) => {
    navigate(`/client/documentos/${codigo}`);
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-[#003595] mb-4">{title}</h2>
      <div className="overflow-auto max-h-[400px] rounded border border-blue-700">
        <table className="w-full text-left">
          <thead className="bg-white text-[#003595] border-b">
            <tr>
              <th className="p-2"><input type="checkbox" /></th>
              <th className="p-2">Código</th>
              <th className="p-2">Servicio</th>
              <th className="p-2">Fecha aproximada</th>
              <th className="p-2">Toneladas</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((reserva, index) => (
              <tr key={reserva.codigo || index} className="border-b hover:bg-blue-50">
                <td className="p-2"><input type="checkbox" /></td>
                <td className="p-2">{reserva.codigo}</td>
                <td className="p-2">{reserva.servicio}</td>
                <td className="p-2">{reserva.fechaAprox}</td>
                <td className="p-2">{reserva.toneladas}</td>
                <td className="p-2 flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleDocumentosClick(reserva.codigo)}
                    className="border border-[#003595] text-[#003595] px-3 py-1 rounded flex items-center hover:bg-[#003595] hover:text-white transition-colors"
                  >
                    <FaFileAlt className="mr-2" /> Documentos
                  </button>
                  <button
                    className={`px-3 py-1 rounded flex items-center ${editableIndex === index
                      ? "bg-red-500 text-white"
                      : "border border-[#003595] text-[#003595]"
                      }`}
                  >
                    <FaEdit className="mr-2" /> Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right">
        <button className="text-sm text-[#003595] underline hover:text-blue-700">Ver más</button>
      </div>
    </section>
  )
}

export default TableReservations