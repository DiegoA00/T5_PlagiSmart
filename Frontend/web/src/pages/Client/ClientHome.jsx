import NavbarClient from "./Components/NavbarClient";
import Header from "./Components/Header";
import Dashboard from "./Components/DashboardClient";
function ClientHome() {
  return (
    <div className="flex h-screen  flex-col">
      <Header />
      <div className="flex h-screen">
        <NavbarClient />
        <main className="flex-1  bg-white">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default ClientHome;
