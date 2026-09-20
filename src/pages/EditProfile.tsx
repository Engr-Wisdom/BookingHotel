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
  const [phone, setPhone] = useState((user as any)?.phone || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name,
      email,
      phone,
    };

    await updateUser(user!.id, updatedUser as Partial<User>);
    alert("Profile updated successfully.");

    navigate("/profile");
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-5 pt-32 lg:px-20">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-8 text-3xl font-bold text-gray-800">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-semibold">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border p-3 outline-none"
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
                className="w-full rounded-lg border p-3 outline-none"
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
                className="w-full rounded-lg border p-3 outline-none"
              />
            </div>

            <button
              className="
                w-full
                rounded-lg
                bg-gray-800
                py-3
                text-white
                transition
                hover:bg-gray-700
              "
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;