import DashboardClient from "./Components/DashboardClient";
import { Layout } from "../../layouts/Layout";

function PendingRequest() {
  return (
    <Layout>
      <main className="flex-1 bg-white overflow-y-scroll scrollbar-hide ">
        <DashboardClient
          showHeader={false}
          showNewButton={false}
          tablesToShow={['enCurso']}
          title="Gestión de Reservas"
        />
      </main>
    </Layout>
  );
}

export default PendingRequest;
