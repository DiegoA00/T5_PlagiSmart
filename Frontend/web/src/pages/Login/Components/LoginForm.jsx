import { useState } from "react";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted: ", form);
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
    </form>
  );
};

export default LoginForm;
