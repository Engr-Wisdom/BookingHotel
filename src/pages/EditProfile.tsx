import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";
import type { User } from "../api/authApi";

const EditProfile = () => {
  const navigate = useNavigate();

  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to update your profile.");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const updatedUser = {
        ...user,
        name,
        email,
        phone,
      };

      await updateUser(user.id, updatedUser as Partial<User>);

      setSuccess("Your profile has been updated successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } catch (error) {
      console.error("Error updating profile:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-100 px-5 pb-16 pt-32 lg:px-20">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">
            Edit Profile
          </h1>

          {success && (
            <div
              role="status"
              className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 font-semibold">
                ✓
              </span>

              <span>{success}</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-gray-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-gray-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Phone Number
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-gray-500 disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 py-3 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Profile...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;