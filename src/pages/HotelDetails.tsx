import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Map from "../components/Map";

import { assets } from "../assets/assets";
import { getHotelById } from "../api/hotelApi";

import type { Hotel } from "../api/hotelApi";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [mainImage, setMainImage] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);

      try {
        const data = await getHotelById(Number(id));

        if (data) {
          setHotel(data);

          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0]);
          } else {
            setMainImage(data.image);
          }
        } else {
          setHotel(null);
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const getAmenityIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "free wifi":
        return assets.freeWifiIcon;

      case "free breakfast":
        return assets.freeBreakfastIcon;

      case "room service":
        return assets.roomServiceIcon;

      default:
        return assets.homeIcon;
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  const totalPrice = hotel && nights > 0
    ? nights * hotel.price * guests
    : 0;

  const hotelImages = hotel?.images && hotel.images.length > 0
    ? hotel.images
    : hotel
      ? [hotel.image]
      : [];

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const validateBookingDates = () => {
    let isValid = true;

    setCheckInError("");
    setCheckOutError("");

    const today = getTodayDate();

    if (!checkIn) {
      setCheckInError("Please select a check-in date.");
      isValid = false;
    } else if (checkIn < today) {
      setCheckInError(
        "Check-in date must not be earlier than today.",
      );
      isValid = false;
    }

    if (!checkOut) {
      setCheckOutError("Please select a check-out date.");
      isValid = false;
    }

    if (checkIn && checkOut && checkOut <= checkIn) {
      setCheckOutError(
        "Check-out date must be later than the check-in date.",
      );
      isValid = false;
    }

    return isValid;
  };

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    setCheckInError("");

    if (value) {
      const today = getTodayDate();

      if (value < today) {
        setCheckInError(
          "Check-in date must not be earlier than today.",
        );
      }
    }

    if (checkOut && value && checkOut <= value) {
      setCheckOutError(
        "Check-out date must be later than the check-in date.",
      );
    } else {
      setCheckOutError("");
    }
  };

  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    setCheckOutError("");

    if (value && checkIn && value <= checkIn) {
      setCheckOutError(
        "Check-out date must be later than the check-in date.",
      );
    }
  };

  const handleBooking = () => {
    const isValid = validateBookingDates();

    if (!isValid || !hotel) {
      return;
    }

    setBookingLoading(true);

    setTimeout(() => {
      navigate(`/booking/${hotel.id}`, {
        state: {
          hotel,
          checkIn,
          checkOut,
          guests,
          nights,
          totalPrice,
        },
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="min-h-screen bg-gray-100 pt-25">
        {loading ? (
          <div className="flex min-h-[70vh] items-center justify-center bg-white px-6">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />

              <p className="mt-5 text-lg font-semibold text-gray-700">
                Loading Hotel...
              </p>
            </div>
          </div>
        ) : !hotel ? (
          <div className="flex min-h-[70vh] items-center justify-center bg-white px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Hotel Not Found
              </h2>

              <p className="mt-3 text-gray-500">
                The hotel you are looking for could not be found.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 cursor-pointer rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
              >
                Back to Hotels
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-100 px-5 pb-10 lg:px-20">
            {/* HOTEL HEADER */}
            <div className="mb-8 rounded-2xl bg-white p-8">
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {hotel.name}
                  </h1>

                  <p className="mt-3 text-gray-500">
                    📍 {hotel.location}
                  </p>

                  <p className="mt-3 text-gray-500">
                    ⭐ {hotel.rate} • {hotel.reviews}
                  </p>
                </div>

                <div>
                  <span className="rounded-full bg-red-500 px-4 py-1 text-white">
                    20% OFF
                  </span>

                  <h2 className="mt-4 text-3xl font-bold">
                    ${hotel.price}

                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      / night
                    </span>
                  </h2>
                </div>
              </div>
            </div>

            {/* HOTEL IMAGES */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
              <img
                src={mainImage}
                alt={hotel.name}
                className="h-[520px] w-full rounded-3xl object-cover"
              />

              <div className="grid grid-cols-2 gap-5">
                {hotelImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={hotel.name}
                    onClick={() => setMainImage(image)}
                    className={`h-[250px] w-full cursor-pointer rounded-2xl object-cover transition hover:scale-105 ${
                      mainImage === image
                        ? "ring-4 ring-gray-800"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* AMENITIES */}
            <div className="mt-8 rounded-2xl bg-white p-8">
              <h2 className="mb-5 text-2xl font-bold">
                Amenities
              </h2>

              <div className="flex flex-wrap gap-8">
                {hotel.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={getAmenityIcon(item)}
                      className="w-6"
                      alt={item}
                    />

                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* BOOKING SECTION */}
            <div className="mt-8 rounded-2xl bg-white p-8">
              <h2 className="mb-6 text-2xl font-bold">
                Check Availability
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                {/* CHECK-IN */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check-in Date
                  </label>

                  <input
                    type="date"
                    value={checkIn}
                    min={getTodayDate()}
                    onChange={(e) =>
                      handleCheckInChange(e.target.value)
                    }
                    className={`w-full cursor-pointer rounded-lg border p-3 outline-none transition ${
                      checkInError
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                    }`}
                  />

                  <div className="min-h-[20px]">
                    {checkInError && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        {checkInError}
                      </p>
                    )}
                  </div>
                </div>

                {/* CHECK-OUT */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Check-out Date
                  </label>

                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || getTodayDate()}
                    onChange={(e) =>
                      handleCheckOutChange(e.target.value)
                    }
                    className={`w-full cursor-pointer rounded-lg border p-3 outline-none transition ${
                      checkOutError
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                    }`}
                  />

                  <div className="min-h-[20px]">
                    {checkOutError && (
                      <p className="mt-2 text-sm font-medium text-red-500">
                        {checkOutError}
                      </p>
                    )}
                  </div>
                </div>

                {/* GUESTS */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Guests
                  </label>

                  <select
                    value={guests}
                    onChange={(e) =>
                      setGuests(Number(e.target.value))
                    }
                    className="w-full cursor-pointer rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                  </select>

                  <div className="min-h-[20px]" />
                </div>

                {/* BOOKING BUTTON */}
                <div className="flex items-start pt-8">
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-3 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {bookingLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Booking...
                      </>
                    ) : (
                      "Continue Booking"
                    )}
                  </button>
                </div>
              </div>

              {nights > 0 && !checkInError && !checkOutError && (
                <div className="mt-6 rounded-xl bg-gray-100 p-5">
                  <p>
                    {nights} nights × ${hotel.price}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Total: ${totalPrice}
                  </h3>
                </div>
              )}
            </div>

            {/* ABOUT HOTEL */}
            <div className="mt-8 rounded-2xl bg-white p-8">
              <h2 className="text-2xl font-bold">
                About this place
              </h2>

              <p className="mt-4 leading-8 text-gray-600">
                {hotel.description ||
                  "No description available for this hotel."}
              </p>
            </div>

            {/* MAP */}
            <div className="relative z-0 mt-8 rounded-2xl bg-white p-8">
              <h2 className="text-2xl font-bold">
                Location on map
              </h2>

              <div className="relative z-0 mt-6 overflow-hidden rounded-2xl">
                <Map />
              </div>
            </div>

            {/* HOST */}
            <div className="mb-20 mt-8 rounded-2xl bg-white p-8">
              <h2 className="text-2xl font-bold">
                It's like a home away from home.
              </h2>

              {hotel.host ? (
                <>
                  <h3 className="mt-5 text-xl font-semibold">
                    Hosted by {hotel.host.name}
                  </h3>

                  <p className="text-gray-600">
                    {hotel.host.reviews}
                  </p>

                  <p className="text-gray-600">
                    Response rate: {hotel.host.responseRate}
                  </p>

                  <p className="text-gray-600">
                    Response time: {hotel.host.responseTime}
                  </p>

                  <button className="mt-6 cursor-pointer rounded-full bg-gray-800 px-8 py-3 text-white transition hover:bg-gray-700">
                    Contact Now
                  </button>
                </>
              ) : (
                <p className="mt-5 text-gray-600">
                  Host information is not available.
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;