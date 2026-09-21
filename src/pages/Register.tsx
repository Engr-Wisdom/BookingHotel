import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: UserRole | "";
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    setSuccess("");

    if (!formData.role) {
      setError("Please select whether you are a guest or hotel owner.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    };

    try {
      const success = await register(userData);

      if (success) {
        setSuccess("Account created successfully. Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-5 py-32">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-center text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="mb-6 mt-2 text-center text-gray-500">
            Join our hotel booking platform
          </p>

          {error && (
            <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-600">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-500"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-500"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Account Type
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full cursor-pointer rounded-lg border bg-white p-3 outline-none focus:border-gray-500"
              >
                <option value="" disabled>
                  Select account type
                </option>

                <option value="guest">
                  Guest
                </option>

                <option value="hotel_owner">
                  Hotel Owner
                </option>
              </select>
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3 outline-none focus:border-gray-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-800 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-center text-gray-600">
            Already have an account?

            <span
              onClick={() => navigate("/login")}
              className="ml-2 cursor-pointer text-blue-600 hover:underline"
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