import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError("");

    if (
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    const success = await register(userData);
    if (success) {
      alert(
        "Account created successfully. Please log in.",
      );

      navigate("/login");
    } else {
      setError(
        "Registration failed. Please try again.",
      );
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-5 py-32">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-center text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="mt-2 mb-6 text-center text-gray-500">
            Join our hotel booking platform
          </p>

          {error && (
            <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none"
            />

            <button
              disabled={loading}
              className="w-full rounded-lg bg-gray-800 py-3 font-semibold text-white transition hover:bg-gray-700"
            >
              {loading
                ? "Creating account..."
                : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-center text-gray-600">
            Already have an account?

            <span
              onClick={() => navigate("/login")}
              className="ml-2 cursor-pointer text-blue-600"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;