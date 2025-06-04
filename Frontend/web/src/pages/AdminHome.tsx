// src/pages/RequestsPage.tsx
import { useState, FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipos
type Request = {
  id: string;
  service: string;
  client: string;
  date: string;
  tons: number;
};

const REQUESTS: Request[] = [
  { id: "#12345", service: "Residential Fumigation", client: "Sophia Carter", date: "2024-03-15", tons: 2 },
  { id: "#12346", service: "Commercial Fumigation", client: "Tech Solutions Inc.", date: "2024-03-16", tons: 15 },
  { id: "#12347", service: "Agricultural Fumigation", client: "Green Acres Farm", date: "2024-03-17", tons: 50 },
  { id: "#12348", service: "Residential Fumigation", client: "Ethan Lee", date: "2024-03-18", tons: 3 },
  { id: "#12349", service: "Commercial Fumigation", client: "Retail Emporium", date: "2024-03-19", tons: 20 },
  { id: "#12350", service: "Agricultural Fumigation", client: "Harvest Fields Co.", date: "2024-03-20", tons: 60 },
  { id: "#12351", service: "Residential Fumigation", client: "Olivia Johnson", date: "2024-03-21", tons: 2 },
  { id: "#12352", service: "Commercial Fumigation", client: "Office Complex Ltd.", date: "2024-03-22", tons: 18 },
  { id: "#12353", service: "Agricultural Fumigation", client: "Sunny Valley Orchards", date: "2024-03-23", tons: 55 },
  { id: "#12354", service: "Residential Fumigation", client: "Liam Brown", date: "2024-03-24", tons: 4 },
];

// Sidebar como componente
const Sidebar: FC = () => (
  <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col">
    <h1 className="text-2xl font-bold mb-12">PLAGISMART</h1>
    <nav className="flex flex-col gap-4">
      <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Dashboard</Button>
      <Button variant="secondary" className="justify-start text-blue-900 bg-white font-semibold">Requests</Button>
      <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Clients</Button>
      <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Services</Button>
      <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Settings</Button>
    </nav>
  </aside>
);

// Tabla como componente
const RequestsTable: FC<{ data: Request[] }> = ({ data }) => (
  <div className="overflow-auto rounded-lg border">
    <table className="min-w-full bg-white text-sm" role="table">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Service</th>
          <th className="px-4 py-3">Client</th>
          <th className="px-4 py-3">Estimated Date</th>
          <th className="px-4 py-3">Tons</th>
          <th className="px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-2">{r.id}</td>
            <td className="px-4 py-2 text-blue-600 cursor-pointer">{r.service}</td>
            <td className="px-4 py-2">{r.client}</td>
            <td className="px-4 py-2">{r.date}</td>
            <td className="px-4 py-2">{r.tons}</td>
            <td className="px-4 py-2 text-blue-600 cursor-pointer font-semibold">View More Info</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function AdminHome() {
  const [search, setSearch] = useState("");
  const filtered = REQUESTS.filter((r) =>
    r.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-white">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Requests</h2>
            <p className="text-gray-500">Manage incoming service requests</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src="/avatar.png" alt="User" className="w-full h-full object-cover" />
          </div>
        </header>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center mb-6">
          <Input
            placeholder="Search requests"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Aquí puedes agregar opciones de filtro */}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Date</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Aquí puedes agregar opciones de filtro */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <RequestsTable data={filtered} />

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="ghost" size="icon" className="w-8 h-8">&lt;</Button>
          <span className="font-medium">1</span>
          <Button variant="ghost" size="icon" className="w-8 h-8">&gt;</Button>
        </div>
      </main>
    </div>
  );
}
