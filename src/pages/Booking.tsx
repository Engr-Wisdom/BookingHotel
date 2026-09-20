import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { createBooking } from "../api/bookingApi";
import { useAuth } from "../context/AuthContext";

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string;
}

interface BookingState {
  hotel?: Hotel;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  nights?: number;
  totalPrice?: number;
}

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const bookingState = location.state as BookingState | null;

  const [hotel, setHotel] = useState<Hotel | null>(
    bookingState?.hotel || null
  );

  const [checkIn, setCheckIn] = useState(
    bookingState?.checkIn || ""
  );

  const [checkOut, setCheckOut] = useState(
    bookingState?.checkOut || ""
  );

  const [guests, setGuests] = useState(
    bookingState?.guests || 1
  );

  const [loading, setLoading] = useState(!bookingState?.hotel);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const [nights, setNights] = useState(
    bookingState?.nights || 0
  );

  const [totalPrice, setTotalPrice] = useState(
    bookingState?.totalPrice || 0
  );

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id || hotel) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:3000/hotels/${id}`
        );

        if (!response.ok) {
          throw new Error("Hotel not found");
        }

        const data = await response.json();

        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
        setError("Unable to load hotel information.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, hotel]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference =
      endDate.getTime() - startDate.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  useEffect(() => {
    if (!hotel) {
      return;
    }

    const calculatedNights = calculateNights();

    setNights(calculatedNights);

    setTotalPrice(
      calculatedNights > 0
        ? calculatedNights * hotel.price
        : 0
    );
  }, [checkIn, checkOut, hotel]);

  const handleSaveChanges = () => {
    setError("");

    if (!checkIn || !checkOut) {
      setError(
        "Please select both check-in and check-out dates."
      );
      return;
    }

    const calculatedNights = calculateNights();

    if (calculatedNights <= 0) {
      setError(
        "Check-out date must be after the check-in date."
      );
      return;
    }

    if (guests < 1) {
      setError("Please select at least one guest.");
      return;
    }

    if (!hotel) {
      setError("Hotel information is unavailable.");
      return;
    }

    setNights(calculatedNights);
    setTotalPrice(calculatedNights * hotel.price);

    setEditing(false);
  };

  const handleCancelEdit = () => {
    if (bookingState?.checkIn) {
      setCheckIn(bookingState.checkIn);
    }

    if (bookingState?.checkOut) {
      setCheckOut(bookingState.checkOut);
    }

    if (bookingState?.guests) {
      setGuests(bookingState.guests);
    }

    if (bookingState?.nights) {
      setNights(bookingState.nights);
    }

    if (bookingState?.totalPrice) {
      setTotalPrice(bookingState.totalPrice);
    }

    setError("");
    setEditing(false);
  };

  const handleBooking = async () => {
    setError("");

    if (!user) {
      setError(
        "You must be logged in to complete a booking."
      );
      return;
    }

    if (!hotel) {
      setError("Hotel information is unavailable.");
      return;
    }

    if (editing) {
      setError(
        "Please save your changes before confirming your booking."
      );
      return;
    }

    if (!checkIn || !checkOut) {
      setError(
        "Please select both check-in and check-out dates."
      );
      return;
    }

    const calculatedNights = calculateNights();

    if (calculatedNights <= 0) {
      setError(
        "Check-out date must be after the check-in date."
      );
      return;
    }

    if (guests < 1) {
      setError("Please select at least one guest.");
      return;
    }

    try {
      setBookingLoading(true);

      await createBooking({
        userId: user.id,
        hotelId: hotel.id,
        hotelName: hotel.name,
        image: hotel.image,
        location: hotel.location,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: "Pending",
      });

      sessionStorage.setItem(
        "bookingSuccess",
        "true"
      );

      navigate("/my-bookings");
    } catch (error) {
      console.error(
        "Error creating booking:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"></div>

            <p className="mt-4 text-sm text-gray-500">
              Loading booking details...
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-6xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white px-6 py-14 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Hotel Not Found
            </h1>

            <p className="mt-2 text-gray-500">
              We could not find the hotel you are trying to
              book.
            </p>

            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="mt-6 cursor-pointer rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Browse Hotels
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 cursor-pointer text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Booking
          </h1>

          <p className="mt-2 text-gray-500">
            Review your reservation details before confirming.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Booking Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Hotel Card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row">
                <div className="h-56 w-full shrink-0 sm:h-auto sm:w-64">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {hotel.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {hotel.location}
                  </p>

                  <div className="mt-5">
                    <span className="text-2xl font-bold text-gray-900">
                      ${hotel.price}
                    </span>

                    <span className="ml-1 text-sm text-gray-500">
                      / night
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Reservation Details
                </h2>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setEditing(true);
                    }}
                    className="cursor-pointer text-sm font-medium text-gray-700 underline transition hover:text-gray-900"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Check-in */}
                <div>
                  <label
                    htmlFor="checkIn"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Check-in
                  </label>

                  {editing ? (
                    <input
                      id="checkIn"
                      type="date"
                      value={checkIn}
                      min={new Date()
                        .toISOString()
                        .split("T")[0]}
                      onChange={(e) =>
                        setCheckIn(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                  ) : (
                    <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">
                      {new Date(
                        checkIn
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                {/* Check-out */}
                <div>
                  <label
                    htmlFor="checkOut"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Check-out
                  </label>

                  {editing ? (
                    <input
                      id="checkOut"
                      type="date"
                      value={checkOut}
                      min={
                        checkIn ||
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setCheckOut(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                  ) : (
                    <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">
                      {new Date(
                        checkOut
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                {/* Guests */}
                <div>
                  <label
                    htmlFor="guests"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Guests
                  </label>

                  {editing ? (
                    <input
                      id="guests"
                      type="number"
                      min="1"
                      max="20"
                      value={guests}
                      onChange={(e) =>
                        setGuests(
                          Math.max(
                            1,
                            Number(e.target.value)
                          )
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                    />
                  ) : (
                    <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">
                      {guests}{" "}
                      {guests === 1
                        ? "Guest"
                        : "Guests"}
                    </div>
                  )}
                </div>

                {/* Nights */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nights
                  </label>

                  <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-800">
                    {nights}{" "}
                    {nights === 1
                      ? "Night"
                      : "Nights"}
                  </div>
                </div>
              </div>

              {/* Edit Buttons */}
              {editing && (
                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="cursor-pointer rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="cursor-pointer rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Price Summary
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    ${hotel.price} × {nights}{" "}
                    {nights === 1
                      ? "night"
                      : "nights"}
                  </span>

                  <span className="font-medium text-gray-800">
                    ${totalPrice}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Guests
                  </span>

                  <span className="font-medium text-gray-800">
                    {guests}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleBooking}
                disabled={
                  bookingLoading ||
                  editing ||
                  nights <= 0
                }
                className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    Confirming...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>

              {editing && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Save your changes before confirming your
                  booking.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;