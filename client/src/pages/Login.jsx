import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import useAuth from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);

      alert(response.data.message);

      await fetchUser();
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-6">
      <div className="w-full max-w-md bg-[#1e293b] rounded-2xl p-6 sm:p-8 shadow-xl text-white">

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-400 mt-4 text-sm sm:text-base">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;