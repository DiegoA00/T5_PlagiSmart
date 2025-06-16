import { useState } from "react";
import { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const privacyPolicy = () => {
    navigate('/register/privacy-policy')
  }

  const termsAndConditions = () => {
    navigate('/register/terms-and-conditions')
  }

  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    accept: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, repeatPassword, accept } = form;

    if (!email || !password || !repeatPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!accept) {
      setError("You must accept the privacy policy and terms and conditions.");
      return;
    }

    try {
      //const token = await register(email, password);

      setError("You will receive a confirmation email on the next minutes if you don't have an account");

      setForm({
        email: "",
        password: "",
        repeatPassword: "",
        accept: false,
      });

      navigate("/register/success");

    } catch (err) {
      console.error("Register failed:", err);

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
          Email
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#9E896A]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="repeatPassword"
            placeholder="Repeat your password"
            value={form.repeatPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#9E896A]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="accept"
            checked={form.accept}
            onChange={handleChange}
            className="accent-[#9E896A] cursor-pointer"
          />
          I agree to the
          <button type="button" className="cursor-pointer text-[#9E896A] hover:underline" onClick={privacyPolicy}>
            privacy policy
          </button>
          and
          <button type="button" className="cursor-pointer text-[#9E896A] hover:underline" onClick={termsAndConditions}>
            terms and conditions
          </button>
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-[#9E896A] text-white px-6 py-2 rounded-full hover:bg-[#826f56] transition-colors w-full sm:w-auto cursor-pointer"
        >
          Register
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

export default RegisterForm;
