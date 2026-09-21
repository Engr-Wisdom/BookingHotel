import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { assets, exclusiveOffers, testimonials } from "../assets/assets";
import HotelCard from "../components/HotelCard";
import Footer from "../components/Footer";
import { getHotels } from "../api/hotelApi";
import type { Hotel } from "../api/hotelApi";

function Home() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHotels();

        setHotels(data);
      } catch (error) {
        console.error("Error loading hotels:", error);
        setError("Unable to load hotels.");
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  return (
    <div>
      <Navbar />

      <Hero />

      <div className="bg-gray-200 px-5 py-30 sm:px-10 lg:px-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl sm:text-4xl">
            Featured Hotels
          </h1>

          <p className="mt-5 max-w-3xl text-gray-700">
            Discover our handpicked selection of exceptional
            properties around the world, offering unparalleled
            luxury and unforgettable experiences.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>

              <p className="mt-4 text-gray-600">
                Loading hotels...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-gray-800 px-5 py-2 text-white transition hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        ) : hotels.length === 0 ? (
          <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              No hotels are available at the moment.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() =>
                  navigate(`/hotel/${hotel.id}`)
                }
                className="cursor-pointer"
              >
                <HotelCard
                  hotel={{
                    img: hotel.image,
                    name: hotel.name,
                    address: hotel.address,
                    reviews: hotel.reviews || "0 reviews",
                    location: hotel.location,
                    amenities: hotel.amenities,
                    rate: hotel.rate || "0",
                    price: hotel.price,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-30 sm:px-10 lg:px-20">
        <div className="max-w-2xl">
          <h1 className="text-2xl lg:text-4xl">
            Exclusive Offers
          </h1>

          <p className="mt-5 font-semibold text-gray-700">
            Take advantage of our limited-time offers and
            special packages to enhance your stay and create
            unforgettable memories.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exclusiveOffers.map((offer, id) => (
            <div
              key={id}
              className="group relative overflow-hidden rounded-3xl shadow-lg transition-all hover:-translate-y-2"
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="h-full w-full object-cover transition duration-500"
              />

              <div className="absolute bottom-5 left-0 top-5 z-10 p-6 text-white">
                <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur-sm">
                  {offer.priceOff}% OFF
                </span>

                <h2 className="mt-3 text-2xl font-bold">
                  {offer.title}
                </h2>

                <p className="mt-2 max-w-xs text-sm text-gray-200">
                  {offer.description}
                </p>

                <p className="mt-4 text-sm text-gray-300">
                  Expires: {offer.expiryDate}
                </p>

                <button className="mt-4 rounded-full font-semibold transition hover:scale-105">
                  View Offers
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-200 px-5 py-30 sm:px-10 lg:px-20">
        <div className="flex flex-col items-center text-center font-semibold">
          <h1 className="text-2xl lg:text-4xl">
            What our Guests Say
          </h1>

          <p className="mt-5 max-w-2xl text-gray-700">
            Discover why discerning travelers choose
            QuickStay for their luxury accommodations around
            the world.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, id) => (
            <div
              key={id}
              className="rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-16 w-16 rounded-full object-cover"
                />

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {testimonial.address}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1">
                {[...Array(testimonial.rating)].map(
                  (_, index) => (
                    <img
                      key={index}
                      src={assets.starIconFilled}
                      alt="star"
                      className="w-4"
                    />
                  )
                )}
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-40 sm:px-10 lg:px-20">
        <div className="flex flex-col items-center rounded-2xl bg-gray-800 p-10 text-center font-semibold text-white">
          <h1 className="text-2xl lg:text-4xl">
            Stay Inspired
          </h1>

          <p className="mt-5 max-w-2xl text-gray-200">
            Join our newsletter and be the first to discover
            new destinations, exclusive offers, and travel
            inspiration.
          </p>

          <div className="mt-10 flex items-center gap-10">
            <input
              type="text"
              placeholder="Enter your email"
              className="w-70 rounded border-2 bg-gray-700 p-2 outline-none"
            />

            <button className="cursor-pointer rounded bg-black px-5 p-2 text-white hover:bg-gray-900">
              Subscribe
            </button>
          </div>

          <p className="mt-10 font-light">
            By subscribing, you agree to our Private Policy
            and consent to receive updates.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;