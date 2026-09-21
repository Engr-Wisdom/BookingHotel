import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { getBookingsByUser } from "../api/bookingApi";

interface DashboardBooking {
  id: number;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
}

const HotelDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<
    DashboardBooking[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userBookings =
          await getBookingsByUser(user.id);

        setBookings(userBookings);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status.toLowerCase() === "pending"
  );

  const totalRevenue = bookings.reduce(
    (total, booking) =>
      total + Number(booking.totalPrice || 0),
    0
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Please log in to access your dashboard.
            </h1>

            <button
              onClick={() => navigate("/login")}
              className="mt-5 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
            >
              Login
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (user.role !== "hotel_owner") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Access Denied
            </h1>

            <p className="mt-2 text-gray-500">
              This dashboard is only available to hotel
              owners.
            </p>

            <button
              onClick={() => navigate("/my-bookings")}
              className="mt-5 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
            >
              Go to My Bookings
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-10 pt-25">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Hotel Owner
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back, {user.name}. Manage your hotels
            and reservations from here.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"></div>

              <p className="mt-4 text-gray-500">
                Loading dashboard...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      My Hotels
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                      0
                    </h2>
                  </div>

                  <div className="rounded-xl bg-blue-100 p-3 text-2xl">
                    🏨
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Total Bookings
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                      {bookings.length}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-green-100 p-3 text-2xl">
                    📅
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Pending Bookings
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                      {pendingBookings.length}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-yellow-100 p-3 text-2xl">
                    ⏳
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Revenue
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                      ${totalRevenue.toLocaleString()}
                    </h2>
                  </div>

                  <div className="rounded-xl bg-purple-100 p-3 text-2xl">
                    💰
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">
                  Quick Actions
                </h2>

                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => navigate("/add-hotel")}
                    className="w-full rounded-lg bg-gray-800 px-4 py-3 text-left font-semibold text-white transition hover:bg-gray-700"
                  >
                    + Add New Hotel
                  </button>

                  <button
                    onClick={() => navigate("/my-hotels")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    🏨 Manage My Hotels
                  </button>

                  <button
                    onClick={() =>
                      navigate("/hotel-bookings")
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    📅 View Bookings
                  </button>

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    ⚙️ Account Settings
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Bookings
                  </h2>

                  <button
                    onClick={() =>
                      navigate("/hotel-bookings")
                    }
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View all
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-4xl">📅</div>

                    <h3 className="mt-3 font-semibold text-gray-700">
                      No bookings yet
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Your hotel reservations will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead>
                        <tr className="border-b text-sm text-gray-500">
                          <th className="pb-3 font-medium">
                            Hotel
                          </th>

                          <th className="pb-3 font-medium">
                            Check-in
                          </th>

                          <th className="pb-3 font-medium">
                            Guests
                          </th>

                          <th className="pb-3 font-medium">
                            Status
                          </th>

                          <th className="pb-3 font-medium">
                            Amount
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {bookings
                          .slice(0, 5)
                          .map((booking) => (
                            <tr
                              key={booking.id}
                              className="border-b last:border-0"
                            >
                              <td className="py-4 font-medium text-gray-800">
                                {booking.hotelName}
                              </td>

                              <td className="py-4 text-sm text-gray-500">
                                {booking.checkIn}
                              </td>

                              <td className="py-4 text-sm text-gray-500">
                                {booking.guests}
                              </td>

                              <td className="py-4">
                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                  {booking.status}
                                </span>
                              </td>

                              <td className="py-4 font-semibold text-gray-800">
                                $
                                {Number(
                                  booking.totalPrice
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HotelDashboard;