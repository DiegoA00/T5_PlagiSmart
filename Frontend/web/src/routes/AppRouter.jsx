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

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/mailrecovery' element={<MailRecovery />} />
        <Route path='/coderecovery' element={<CodeRecovery />} />
        <Route path='/passwordrecovery' element={<PasswordRecovery />} />
        <Route path='*' element={<Navigate to='/Login' />} />
      </Routes>
    </Router>
  );
}
