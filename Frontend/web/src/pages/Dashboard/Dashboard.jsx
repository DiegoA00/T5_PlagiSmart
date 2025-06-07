import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        setUser({
            name: decoded.name,
            nationalId: decoded.nationalId,
            email: decoded.email,
            location: decoded.location,
            id: decoded.id,
            lastName: decoded.lastName,
      });
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Bienvenido, {user.name} {user.lastName} – {user.nationalId}
      </h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>National ID:</strong> {user.nationalId}</p>
      <p><strong>Location:</strong> {user.location}</p>
    </div>
  );
};

export default Dashboard;
