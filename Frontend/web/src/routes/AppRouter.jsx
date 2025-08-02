import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivacyPolicy from "../pages/Register/PrivacyPolicy";
import TermsAndConditions from "../pages/Register/TermsAndConditions";
import RegisterSuccess from "../pages/Register/RegisterSuccess";
import CompleteProfile from "../pages/Register/CompleteProfile";
import PendingRequest from "../pages/Client/PendingRequest";
import OnGoingRequest from "@/pages/Client/OnGoingRequest";
import FinishedRequest from "@/pages/Client/FinishedRequest";
import DocumentosReserva from "../pages/Client/ReservationDocuments";
import MailRecovery from "../pages/Recovery/MailRecovery";
import CodeRecovery from "../pages/Recovery/CodeRecovery";
import PasswordRecovery from "../pages/Recovery/PasswordRecovery";

import Dashboard from "../pages/Dashboard/Dashboard";
import ClientHome from "@/pages/Client/ClientHome";

import Solicitudes from "@/pages/Admin/RequestsPage";
import LotsInService from "../pages/Admin/LotsPage";
import CompletedServicesPage from "@/pages/Admin/CompletedServicesPage";

import NotImplemented from "@/pages/NotImplemented";
import TechnicianLotsPage from "@/pages/Technician/TechnicianLotsPage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/login/mailrecovery' element={<MailRecovery />} />
        <Route path='/login/coderecovery' element={<CodeRecovery />} />
        <Route path='/login/passwordrecovery' element={<PasswordRecovery />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/register/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/register/success' element={<RegisterSuccess />} />
        <Route path='/register/complete-profile' element={<CompleteProfile />} />
        <Route path='/client/solicitudes-pendientes' element={<PendingRequest />} />
        <Route path='/client/solicitudes-en-curso' element={<OnGoingRequest />} />
        <Route path='/client/solicitudes-finalizadas' element={<FinishedRequest />} />
        <Route path='/client/documentos/:codigo' element={<DocumentosReserva />} />

        {/* <Route path='*' element={<Navigate to='/login' />} /> */}
        <Route path='*' element={<Navigate to='/home/*' />} />

        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/home/*' element={<ClientHome />} />

        <Route path='/admin/dashboard' element={<NotImplemented />} />
        <Route path='/admin/solicitudes' element={<Solicitudes />} />
        <Route path='/admin/lotes' element={<LotsInService />} />
        <Route path='/admin/servicios' element={<CompletedServicesPage />} />
        <Route path='/admin/clientes' element={<NotImplemented />} />
        <Route path='/admin/configuracion' element={<NotImplemented />} />

        <Route path='/tecnico/lotes' element={<TechnicianLotsPage />} />
      </Routes>
    </Router>
  );
}
