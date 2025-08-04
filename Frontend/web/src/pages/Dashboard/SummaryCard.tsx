interface Props {
  title: string;
  value: string | number;
}

export const SummaryCard = ({ title, value }: Props) => (
  <div className="bg-white shadow p-4 rounded-xl text-center">
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-2xl font-bold text-green-600">{value}</p>
  </div>
);
