import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  data: {
    Mes: string;
    Exportado: number;
    Presupuestado: number;
    Fumigado: number;
  }[];
}

export const MonthlyChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="Mes" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Exportado" fill="#82ca9d" name="TM Exportado" />
      <Bar dataKey="Fumigado" fill="#ffc658" name="TM Fumigado" />
      <Bar dataKey="Presupuestado" fill="#8884d8" name="TM Presupuestado" />
    </BarChart>
  </ResponsiveContainer>
);
