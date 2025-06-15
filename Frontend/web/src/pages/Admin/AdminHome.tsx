// src/pages/RequestsPage.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "@/layouts/Sidebar";
import { Overlay } from "@/layouts/Overlay";
import { OverlayContent } from "@/pages/Admin/Components/OverlayContent";
import { RequestsTable } from "@/pages/Admin/Components/RequestsTable";
import { REQUESTS } from "@/constants/exampleRequests";
import { Request } from "@/types/request";

export default function AdminHome() {
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const filtered = REQUESTS.filter((r) =>
    r.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-10 bg-white">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">Solicitudes</h2>
            <p className="text-gray-500">Gestiona las solicitudes de servicio entrantes</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="/avatar.png"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Search and Filters */}
        <div className="flex gap-4 items-center mb-6">
          <Input
            placeholder="Buscar por cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Fecha</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Opciones de filtro */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <RequestsTable data={filtered} onViewMore={setSelectedRequest} />

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            &lt;
          </Button>
          <span className="font-medium">1</span>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            &gt;
          </Button>
        </div>

        {/* Overlay */}
        <Overlay
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
        >
          {selectedRequest && <OverlayContent request={selectedRequest} />}
        </Overlay>
      </main>
    </div>
  );
}
