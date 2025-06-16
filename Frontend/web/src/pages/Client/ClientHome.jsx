import NavbarClient from "./Components/NavbarClient";
import Header from "./Components/Header";
import Dashboard from "./Components/DashboardClient";
function ClientHome() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex h-full">
        <NavbarClient />
        <main className="flex-1 bg-white overflow-y-scroll scrollbar-hide ">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default ClientHome;
