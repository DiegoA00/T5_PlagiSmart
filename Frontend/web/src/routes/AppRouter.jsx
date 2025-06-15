import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login/Login";
import MailRecovery from "../pages/Recovery/MailRecovery";
import CodeRecovery from "../pages/Recovery/CodeRecovery";
import PasswordRecovery from "../pages/Recovery/PasswordRecovery";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminHome from "@/pages/Admin/AdminHome";
import Solicitudes from "@/pages/Admin/AdminHome";
import NotImplemented from "@/pages/NotImplemented";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/login/mailrecovery' element={<MailRecovery />} />
        <Route path='/login/coderecovery' element={<CodeRecovery />} />
        <Route path='/login/passwordrecovery' element={<PasswordRecovery />} />
        <Route path='*' element={<Navigate to='/login' />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/home/*' element={<AdminHome />} />
        <Route path='/admin/dashboard' element={<NotImplemented />} />
        <Route path='/admin/solicitudes' element={<Solicitudes />} />
        <Route path='/admin/lotes' element={<NotImplemented />} />
        <Route path='/admin/servicios' element={<NotImplemented />} />
        <Route path='/admin/clientes' element={<NotImplemented />} />
        <Route path='/admin/configuracion' element={<NotImplemented />} />
      </Routes>
    </Router>
  );
}
