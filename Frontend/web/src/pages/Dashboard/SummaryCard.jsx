export default function SummaryCard({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl text-center">
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-green-600">{value}</p>
    </div>
  );
}