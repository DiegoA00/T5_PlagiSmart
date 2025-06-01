import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    email: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type} = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextPage = () => {
    navigate('/login/coderecovery')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email} = form;

    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const token = await login(email, password);

      localStorage.setItem("token", token);
      console.log("Successfully logged in. Token saved:", token);
      setError("");

      navigate("/dashboard");

    } catch (err) {
      console.error("Login failed:", err);

      if (err.status === 401) {
        setError("Incorrect email or password.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-lg w-full"
    >

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Enter Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9E896A]"
        />
      </div>

      <div className="text-center">
        <button
          onClick={nextPage}
          type="submit"
          className="bg-[#9E896A] text-white px-15 py-2 rounded-full hover:bg-[#826f56] transition-colors w-full sm:w-auto cursor-pointer"
        >
          Submit
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-300 flex items-center gap-2 text-sm">
          <span>⚠️</span> {error}
        </div>
      )}
    </form>
  );
};

export default LoginForm;
