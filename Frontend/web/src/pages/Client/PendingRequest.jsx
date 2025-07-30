import NavbarClient from "./Components/NavbarClient";
import Header from "./Components/Header";
import DashboardClient from "./Components/DashboardClient";
function PendingRequest() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex h-full">
        <NavbarClient />
        <main className="flex-1 bg-white overflow-y-scroll scrollbar-hide ">
          <DashboardClient
            showHeader={false}
            showNewButton={false}
            tablesToShow={['pendientes']}
            title="Gestión de Reservas"
          />
        </main>
      </div>
    </div>
  );
}

export default PendingRequest;
