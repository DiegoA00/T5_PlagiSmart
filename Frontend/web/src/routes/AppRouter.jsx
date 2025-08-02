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

import Dashboard from "../pages/Dashboard/Dashboard";
import ClientHome from "@/pages/Client/ClientHome";

import Solicitudes from "@/pages/Admin/RequestsPage";
import LotsInService from "../pages/Admin/LotsPage";
import CompletedServicesPage from "@/pages/Admin/CompletedServicesPage";
import UsersPage from "@/pages/Admin/UsersPage";

import NotImplemented from "@/pages/NotImplemented";
import TechnicianLotsPage from "@/pages/Technician/TechnicianLotsPage";
import ProtectedRoute from "./ProtectedRouter";

import AdminDashboard from "@/pages/Dashboard/AdminDashboard";

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

        <Route path='/dashboard' element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_TECHNICIAN', 'ROLE_CLIENT']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path='/home/*' element={
          <ProtectedRoute allowedRoles={['ROLE_CLIENT']}>
            <ClientHome />
          </ProtectedRoute>
        } />

        <Route path='/admin/dashboard' element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <NotImplemented />
          </ProtectedRoute>
        } />
        <Route path='/admin/solicitudes' element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <Solicitudes />
          </ProtectedRoute>
        } />
        <Route path='/admin/lotes' element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <LotsInService />
          </ProtectedRoute>
        } />
        <Route path='/admin/servicios' element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <CompletedServicesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/usuarios" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path='/admin/configuracion' element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <NotImplemented />
          </ProtectedRoute>
        } />

        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/solicitudes' element={<Solicitudes />} />
        <Route path='/admin/lotes' element={<LotsInService />} />
        <Route path='/admin/servicios' element={<CompletedServicesPage />} />
        <Route path='/admin/clientes' element={<NotImplemented />} />
        <Route path='/admin/configuracion' element={<NotImplemented />} />
        <Route path='/tecnico/lotes' element={
          <ProtectedRoute allowedRoles={['ROLE_TECHNICIAN']}>
            <TechnicianLotsPage />
          </ProtectedRoute>
        } />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}
