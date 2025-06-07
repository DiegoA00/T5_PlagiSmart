import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-12">PLAGISMART</h1>
      <nav className="flex flex-col gap-4">
        <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Dashboard</Button>
        <Button variant="secondary" className="justify-start text-blue-900 bg-white font-semibold">Solicitudes</Button>
        <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Lotes a fumigar</Button>
        <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Servicios finalizados</Button>
        <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Clientes</Button>
        <Button variant="ghost" className="justify-start text-white hover:bg-blue-800">Configuración</Button>
      </nav>
    </aside>
  );
}