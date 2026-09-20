import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Please log in to view your profile.
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-5 pt-32 lg:px-20">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-md">
          {/* Header */}

          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-800 text-4xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <button
                onClick={() => navigate("/edit-profile")}
                className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-3 text-white"
              >
                <FaEdit />
              </button>
            </div>

            <h1 className="mt-5 text-3xl font-bold text-gray-800">
              {user.name}
            </h1>

            <p className="mt-2 text-gray-500">
              Hotel Booking Member
            </p>
          </div>

          {/* Details */}

          <div className="mt-10 space-y-5">
            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-gray-700">
                Full Name
              </h3>

              <p className="mt-2 text-gray-600">
                {user.name}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-gray-700">
                Email Address
              </h3>

              <p className="mt-2 text-gray-600">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-gray-700">
                Phone Number
              </h3>

              <p className="mt-2 text-gray-600">
                {"phone" in user ? (user as any).phone : "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <h3 className="font-semibold text-gray-700">
                Member Since
              </h3>

              <p className="mt-2 text-gray-600">
                {user.createdAt
                  ? new Date(user.createdAt).toDateString()
                  : "Recently joined"}
              </p>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <button
              onClick={() => navigate("/my-bookings")}
              className="rounded-lg bg-gray-800 py-3 text-white hover:bg-gray-700"
            >
              My Bookings
            </button>

            <button
              onClick={() => navigate("/edit-profile")}
              className="rounded-lg border py-3 hover:bg-gray-100"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500 py-3 text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;