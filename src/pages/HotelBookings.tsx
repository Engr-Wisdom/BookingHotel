import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getBookingsByOwner } from "../api/bookingApi";
import type { Booking } from "../api/bookingApi";
import { useAuth } from "../context/AuthContext";

const HotelBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (user.role !== "hotel_owner") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const ownerBookings = await getBookingsByOwner();

        setBookings(ownerBookings);
      } catch (error) {
        console.error(
          "Error loading hotel bookings:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load hotel bookings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Login Required
            </h1>

            <p className="mt-3 text-gray-600">
              Please log in to view your hotel bookings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Go to Login
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (user.role !== "hotel_owner") {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Access Denied
            </h1>

            <p className="mt-3 text-gray-600">
              Only hotel owners can view hotel bookings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Back to Home
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const formatDate = (date: string) => {
    if (!date) {
      return "N/A";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalRevenue = bookings.reduce(
    (total, booking) =>
      total + Number(booking.totalPrice || 0),
    0
  );

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status.toLowerCase() === "pending"
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 px-5 pb-12 pt-25">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/hotel-dashboard")}
              className="mb-4 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Hotel Bookings
                </h1>

                <p className="mt-2 text-gray-600">
                  View bookings made for your hotels.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/add-hotel")}
                className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                + Add Hotel
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Total Bookings
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {bookings.length}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Pending Bookings
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {pendingBookings}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Booking Revenue
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center rounded-2xl bg-white shadow-sm">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                <p className="mt-4 text-sm text-gray-600">
                  Loading bookings...
                </p>
              </div>
            </div>
          ) : error ? null : bookings.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                📅
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                No bookings yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-600">
                When guests book one of your hotels, their
                reservations will appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/my-hotels")}
                className="mt-6 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Manage My Hotels
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Hotel
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Check-in
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Check-out
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Guests
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                              {booking.image ? (
                                <img
                                  src={booking.image}
                                  alt={booking.hotelName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                  No Image
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                {booking.hotelName}
                              </p>

                              {booking.location && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {booking.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {formatDate(booking.checkIn)}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {formatDate(booking.checkOut)}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {booking.guests}
                          {booking.guests === 1
                            ? " Guest"
                            : " Guests"}
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                          $
                          {Number(
                            booking.totalPrice || 0
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelBookings;