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

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/register/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/register/success' element={<RegisterSuccess />} />
        <Route path='/register/complete-profile' element={<CompleteProfile />} />
        <Route path='*' element={<Navigate to='/Login' />} />
      </Routes>
    </Router>
  );
}
