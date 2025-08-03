import {Layout} from "../../layouts/Layout";
import DashboardFumigacion from "./DashboardFumigacion";

export default function AdminDashboard() {
  return (
    <Layout>
      <main className="flex-1 bg-white overflow-y-scroll scrollbar-hide ">
        <DashboardFumigacion />
      </main>
    </Layout>
  );
}
