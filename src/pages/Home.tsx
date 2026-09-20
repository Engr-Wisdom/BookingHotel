import Navbar from "../components/Navbar";
import Hero from "../components/Hero"
import { assets, exclusiveOffers, testimonials } from "../assets/assets";
import roomImg1  from "../assets/roomImg1.png"
import roomImg2 from "../assets/roomImg2.png"
import roomImg3 from "../assets/roomImg3.png"
import roomImg4 from "../assets/roomImg4.png"
import HotelCard from "../components/HotelCard";
import Footer from "../components/Footer";

const hotels = [
    {
        id: 1,
        img: roomImg1,
        address: "Beachfront Drive, CA, USA",
        name: "Velvet Nights Inn",
        reviews: "200+ reviews",
        location: "Los Angeles, California, USA",
        amenities: [
            "free wifi",
            "free breakfast",
            "room service"
        ],
        price: 120,
        rate: "4.9"
    },

    {
        id: 2,
        img: roomImg2,
        address: "Ocean View Road, Maldives",
        name: "The Grand Resort",
        reviews: "350+ reviews",
        location: "Maldives",
        amenities: [
            "free wifi",
            "swimming pool",
            "spa"
        ],
        price: 450,
        rate: "4.8"
    },

    {
        id: 3,
        img: roomImg3,
        address: "Palm Beach Avenue, Dubai",
        name: "Luxury Beach Resort",
        reviews: "500+ reviews",
        location: "Dubai, UAE",
        amenities: [
            "free wifi",
            "restaurant",
            "room service"
        ],
        price: 550,
        rate: "5.0"
    },

    {
        id: 4,
        img: roomImg4,
        address: "Mountain View Street, Switzerland",
        name: "Mountain View Resort",
        reviews: "180+ reviews",
        location: "Switzerland",
        amenities: [
            "free breakfast",
            "free wifi",
            "gym"
        ],
        price: 400,
        rate: "4.7"
    }
];

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />

      <div className="py-30 px-20 font-semibold bg-gray-200">
        <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-4xl">Featured Hotels</h1>
            <p className="max-w-3xl text-gray-700 mt-5">
              Discover our handpicked selection of exceptional properties around the world, 
              offering unparalleled luxury and unforgottable experiences
            </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel}/>
          ))}
        </div>
      </div>

      <div className="p-20 py-30">
        <div className="max-w-2xl">
          <h1 className="text-2xl lg:text-4xl">Exclusive Offers</h1>
          <p className="mt-5 font-semibold text-gray-700">Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exclusiveOffers.map((offer, id) => (
            <div key={id} className="group relative overflow-hidden rounded-3xl shadow-lg hover:-translate-y-2 transition-all">
              <img
                src={offer.image}
                alt={offer.title}
                className="h-full w-full object-cover transition duration-500"
              />

              <div className="absolute top-5 bottom-5 left-0 z-10 p-6 text-white">
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

      <div className="p-20 py-30 bg-gray-200">
        <div className="flex flex-col items-center text-center font-semibold">
          <h1 className="text-2xl lg:text-4xl">What our Guests Say</h1>
          <p className="w-2xl text-gray-700 mt-5">Discover why discerning travelers choose QuickStay for their luxury accommodations around the world.</p>
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
                {[...Array(testimonial.rating)].map((_, index) => (
                  <img
                    key={index}
                    src={assets.starIconFilled}
                    alt="star"
                    className="w-4"
                  />
                ))}
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-20 py-40">
          <div className="bg-gray-800 p-10 text-white flex flex-col items-center text-center font-semibold rounded-2xl">
            <h1 className="text-2xl lg:text-4xl">Stay Inspired</h1>
            <p className="max-w-2xl text-gray-200 mt-5">
              Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration.
            </p>

            <div className="flex items-center gap-10 mt-10">
              <input type="text" placeholder="Enter your email" className="border-2 p-2 w-70 outline-none rounded bg-gray-700" />
              <button className="bg-black text-white p-2 px-5 rounded cursor-pointer hover:bg-gray-900">Subscribe</button>
            </div>

            <p className="font-light mt-10">By subscribing, you agree to our Private Policy and consents to receive updates.</p>
          </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;