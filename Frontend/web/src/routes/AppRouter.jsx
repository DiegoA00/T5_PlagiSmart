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
import MailRecovery from "../pages/Recovery/MailRecovery";
import CodeRecovery from "../pages/Recovery/CodeRecovery";
import PasswordRecovery from "../pages/Recovery/PasswordRecovery";

import ClientHome from "@/pages/Client/ClientHome";
import ClientProfile from "@/pages/Client/ClientProfile";
import PendingRequest from "../pages/Client/PendingRequest";
import OnGoingRequest from "@/pages/Client/OnGoingRequest";
import FinishedRequest from "@/pages/Client/FinishedRequest";
import DocumentosReserva from "../pages/Client/ReservationDocuments";

import Solicitudes from "@/pages/Admin/RequestsPage";
import LotsInService from "../pages/Admin/LotsPage";
import CompletedServicesPage from "@/pages/Admin/CompletedServicesPage";
import UsersPage from "@/pages/Admin/UsersPage";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";

import NotImplemented from "@/pages/NotImplemented";
import TechnicianLotsPage from "@/pages/Technician/TechnicianLotsPage";
import ProtectedRoute from "./ProtectedRouter";

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
        <Route path='/client/documentos/lote/:lotId' element={<DocumentosReserva />} />
        <Route path='/client/profile' element={<ClientProfile />} />
        <Route path='/client/profile/edit' element={<NotImplemented />} />

        <Route path='/home/*' element={
          <ProtectedRoute allowedRoles={['ROLE_CLIENT']}>
            <Routes>
              <Route path='*' element={<ClientHome />} />
              
            </Routes>
          </ProtectedRoute>
        } />

        <Route path='/admin/*' element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <Routes>
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route path='solicitudes' element={<Solicitudes />} />
              <Route path='lotes' element={<LotsInService />} />
              <Route path='servicios' element={<CompletedServicesPage />} />
              <Route path='usuarios' element={<UsersPage />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path='/tecnico/*' element={
          <ProtectedRoute allowedRoles={['ROLE_TECHNICIAN']}>
            <Routes>
              <Route path='lotes' element={<TechnicianLotsPage />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </Router>
  );
}
