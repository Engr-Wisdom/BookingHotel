import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    const success = await login(email, password);

    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <div
        className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        px-5
        pt-32
      "
      >
        <div
          className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-lg
          p-8
        "
        >
          <h1
            className="
            text-3xl
            font-bold
            text-gray-800
            text-center
          "
          >
            Welcome Back
          </h1>

          <p
            className="
            text-center
            text-gray-500
            mt-2
            mb-6
          "
          >
            Login to continue booking hotels
          </p>

          {error && (
            <div
              className="
              bg-red-100
              text-red-600
              p-3
              rounded-lg
              mb-4
            "
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
              w-full
              border
              rounded-lg
              p-3
              outline-none
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
              w-full
              border
              rounded-lg
              p-3
              outline-none
              "
            />

            <button
              disabled={loading}
              className="
              w-full
              bg-gray-800
              text-white
              py-3
              rounded-lg
              font-semibold
              hover:bg-gray-700
              transition
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p
            className="
            text-center
            text-gray-600
            mt-5
          "
          >
            Don't have an account?
            <span
              onClick={() => navigate("/register")}
              className="
              ml-2
              text-blue-600
              cursor-pointer
              "
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
