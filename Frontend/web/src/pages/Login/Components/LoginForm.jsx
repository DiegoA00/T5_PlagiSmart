import { useState } from "react";
import { login } from "../../../services/auth/loginService";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email;
    const password = form.password;

    try {
      const token = await login(email, password);

      localStorage.setItem("token", token);
      console.log("Successfully login. Token saved:", token);
      setError("");

      // TODO: navigate to /home/dashboard
      // navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        name='email'
        placeholder='Email'
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type='password'
        name='password'
        placeholder='Password'
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type='submit'>Log In</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
