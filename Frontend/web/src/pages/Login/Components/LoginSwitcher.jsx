import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSwitcher = ({ initialActive = "login" }) => {
  const [active, setActive] = useState(initialActive);
  const navigate = useNavigate();

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  const handleClick = (value) => {
    setActive(value);
    navigate(value === "login" ? "/login" : "/register");
  };

  return (
    <div className="flex w-full rounded-full bg-[#F8EDDD] p-2">
      <button
        className={`cursor-pointer flex-1 px-4 py-2 rounded-full transition-colors ${
            active === "login"
            ? "bg-[#9E896A] text-white"
            : "bg-transparent text-[#9E896A]"
        }`}
        onClick={() => handleClick("login")}
      >
        Login
      </button>
      <button
        className={`cursor-pointer flex-1 px-4 py-2 rounded-full transition-colors ${
            active === "register"
            ? "bg-[#9E896A] text-white"
            : "bg-transparent text-[#9E896A]"
        }`}
        onClick={() => handleClick("register")}
      >
        Register
      </button>
    </div>
  );
};

export default LoginSwitcher;
