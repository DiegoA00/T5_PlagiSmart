import DashboardClient from "./Components/DashboardClient";
import {Layout} from "../../layouts/Layout";

function ClientHome() {
  return (
    <Layout>
      <main className="flex-1 bg-white overflow-y-scroll scrollbar-hide ">
        <DashboardClient
          showHeader={true}
          showNewButton={true}
          tablesToShow={['pendientes', 'enCurso', 'finalizadas']}
          title="Gestión de Reservas"
        />
      </main>
    </Layout>
  );
}

export default ClientHome;
