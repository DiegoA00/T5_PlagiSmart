import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const 
LoginSwitcher = ({ initialActive = "login" }) => {
  const [active, setActive] = useState(initialActive);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("register")) {
      setActive("register");
    } else {
      setActive("login");
    }
  }, [location.pathname]);

  const handleClick = (value) => {
    navigate(value === "login" ? "/login" : "/register");   
  };

  return (
    <div className="flex w-full rounded-full bg-[#E6ECF7] p-2">
      <button
        className={`cursor-pointer flex-1 px-4 py-2 rounded-full transition-colors ${active === "login"
          ? "bg-[#003595] text-white"
          : "bg-transparent text-[#003595]"
          }`}
        onClick={() => handleClick("login")}
      >
        Iniciar sesión
      </button>
      <button
        className={`cursor-pointer flex-1 px-4 py-2 rounded-full transition-colors ${active === "register"
          ? "bg-[#003595] text-white"
          : "bg-transparent text-[#003595]"
          }`}
        onClick={() => handleClick("register")}
      >
        Registrarse
      </button>
    </div>
  );
};

export default LoginSwitcher;
