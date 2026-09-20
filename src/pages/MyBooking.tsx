import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  deleteBooking,
  getBookingsByUser,
  type Booking,
} from "../api/bookingApi";

import { useAuth } from "../context/AuthContext";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bookingToDelete, setBookingToDelete] =
    useState<Booking | null>(null);

  const [deleteError, setDeleteError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successHiding, setSuccessHiding] = useState(false);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getBookingsByUser(user.id);

        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Show booking success toast
  useEffect(() => {
    const bookingSuccess =
      sessionStorage.getItem("bookingSuccess");

    if (bookingSuccess === "true") {
      sessionStorage.removeItem("bookingSuccess");

      setShowSuccess(true);
      setSuccessHiding(false);

      const hideTimer = setTimeout(() => {
        setSuccessHiding(true);
      }, 4500);

      const removeTimer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Open delete confirmation
  const handleDeleteClick = (booking: Booking) => {
    setDeleteError("");
    setBookingToDelete(booking);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    if (deletingId !== null) {
      return;
    }

    setBookingToDelete(null);
    setDeleteError("");
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!bookingToDelete) {
      return;
    }

    try {
      setDeletingId(bookingToDelete.id);
      setDeleteError("");

      await deleteBooking(bookingToDelete.id);

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking.id !== bookingToDelete.id
        )
      );

      setBookingToDelete(null);
    } catch (error) {
      console.error("Error deleting booking:", error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete booking."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Success Toast */}
      {showSuccess && (
        <div
          className={`fixed right-5 top-24 z-[9999] w-[calc(100%-2.5rem)] max-w-sm transform transition-all duration-500 ${
            successHiding
              ? "translate-x-[120%] opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-white p-4 shadow-lg">
            {/* Success Icon */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Message */}
            <div className="min-w-0">
              <p className="font-semibold text-gray-800">
                Booking Successful
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Your hotel booking has been created successfully.
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => {
                setSuccessHiding(true);

                setTimeout(() => {
                  setShowSuccess(false);
                }, 500);
              }}
              className="ml-auto shrink-0 cursor-pointer text-gray-400 transition hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Bookings
          </h1>

          <p className="mt-2 text-gray-500">
            View and manage your hotel bookings.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"></div>

              <p className="mt-4 text-sm text-gray-500">
                Loading your bookings...
              </p>
            </div>
          </div>
        )}

        {/* No Bookings */}
        {!loading && bookings.length === 0 && (
          <div className="rounded-xl bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M5 10V8a7 7 0 0114 0v2M5 10v8a2 2 0 002 2h10a2 2 0 002-2v-8M9 14h6"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-800">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You don't have any hotel bookings yet. Find a hotel
              and make your first booking.
            </p>

            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="mt-6 cursor-pointer rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Browse Hotels
            </button>
          </div>
        )}

        {/* Bookings */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Hotel Image */}
                  <div className="h-48 w-full shrink-0 md:h-auto md:w-56 lg:w-64">
                    <img
                      src={booking.image}
                      alt={booking.hotelName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-5">
                    {/* Hotel Name + Status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold text-gray-800">
                          {booking.hotelName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          {booking.location}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status.toLowerCase() ===
                          "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status.toLowerCase() ===
                                "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Check-in
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Check-out
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Guests
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {booking.guests}{" "}
                          {booking.guests === 1
                            ? "Guest"
                            : "Guests"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-bold text-gray-800">
                          ${booking.totalPrice}
                        </p>
                      </div>
                    </div>

                    {/* Delete */}
                    <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteClick(booking)
                        }
                        disabled={
                          deletingId === booking.id
                        }
                        className="cursor-pointer rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === booking.id
                          ? "Deleting..."
                          : "Delete Booking"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {/* Warning Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v4m0 4h.01M10.29 3.86l-7.5 13A2 2 0 004.5 20h15a2 2 0 001.71-3.14l-7.5-13a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-center text-xl font-bold text-gray-800">
              Delete Booking?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to delete your booking at{" "}
              <span className="font-semibold text-gray-700">
                {bookingToDelete.hotelName}
              </span>
              ? This action cannot be undone.
            </p>

            {/* Delete Error */}
            {deleteError && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {deleteError}
              </div>
            )}

            {/* Modal Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={deletingId !== null}
                className="flex-1 cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingId !== null}
                className="flex-1 cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId !== null
                  ? "Deleting..."
                  : "Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;