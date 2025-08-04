interface Props {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export const Filters = ({ selectedMonth, setSelectedMonth }: Props) => {
  const months = ["Todos", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
  return (
    <select
      className="p-2 rounded border border-gray-300"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    >
      {months.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  );
};
