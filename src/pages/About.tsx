import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";

const About = () => {
  const features = [
    {
      title: "Luxury Experience",
      description:
        "Enjoy carefully selected hotels with premium comfort, excellent services, and unforgettable stays.",
      icon: assets.starIconFilled,
    },

    {
      title: "Best Locations",
      description:
        "Discover beautiful destinations with hotels located in amazing places around the world.",
      icon: assets.locationIcon,
    },

    {
      title: "Trusted Service",
      description:
        "We provide a simple and reliable booking experience to help you find your perfect stay.",
      icon: assets.badgeIcon,
    },
  ];

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section
        className="
                pt-40 pb-24 
                px-10 lg:px-20
                bg-gray-800 
                text-white
                "
      >
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-6xl font-bold">About QuickStay</h1>

          <p className="mt-6 text-gray-300 text-lg leading-8">
            QuickStay helps travelers discover and book amazing hotels around
            the world with comfort, convenience, and confidence.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-10 lg:px-20">
        <div
          className="
                grid grid-cols-1 
                lg:grid-cols-2 
                gap-12 
                items-center
                "
        >
          <img
            src={assets.roomImg1}
            alt="Luxury hotel"
            className="
                        rounded-3xl 
                        shadow-lg 
                        w-full
                        "
          />

          <div>
            <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>

            <p className="mt-5 text-gray-600 leading-8">
              QuickStay was created to make hotel booking easier for travelers.
              We connect guests with comfortable hotels, luxury resorts, and
              amazing destinations worldwide.
            </p>

            <p className="mt-4 text-gray-600 leading-8">
              Our goal is to provide a smooth booking experience while helping
              travelers create unforgettable memories.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="
            py-20 
            px-10 lg:px-20 
            bg-gray-100
            "
      >
        <div className="text-center">
          <h2
            className="
                    text-3xl 
                    lg:text-4xl 
                    font-bold 
                    text-gray-800
                    "
          >
            Why Choose Us
          </h2>

          <p className="mt-4 text-gray-600">
            Everything you need for a comfortable stay.
          </p>
        </div>

        <div
          className="
                mt-12 
                grid 
                grid-cols-1 
                md:grid-cols-3 
                gap-8
                "
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                            bg-white 
                            rounded-2xl 
                            p-6 
                            shadow-md
                            hover:-translate-y-2
                            transition
                            "
            >
              <img src={feature.icon} alt={feature.title} className="w-8" />

              <h3
                className="
                            mt-5 
                            text-xl 
                            font-bold 
                            text-gray-800
                            "
              >
                {feature.title}
              </h3>

              <p
                className="
                            mt-3 
                            text-gray-600 
                            leading-7
                            "
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hotel Services */}
      <section className="py-20 px-10 lg:px-20">
        <div
          className="
                grid 
                grid-cols-1 
                md:grid-cols-3 
                gap-8
                text-center
                "
        >
          <div>
            <img src={assets.freeWifiIcon} className="w-10 mx-auto" />

            <h3 className="mt-4 font-bold text-xl">Free Wifi</h3>

            <p className="text-gray-600 mt-2">
              Stay connected wherever you travel.
            </p>
          </div>

          <div>
            <img src={assets.freeBreakfastIcon} className="w-10 mx-auto" />

            <h3 className="mt-4 font-bold text-xl">Free Breakfast</h3>

            <p className="text-gray-600 mt-2">
              Start your day with a delicious meal.
            </p>
          </div>

          <div>
            <img src={assets.roomServiceIcon} className="w-10 mx-auto" />

            <h3 className="mt-4 font-bold text-xl">Room Service</h3>

            <p className="text-gray-600 mt-2">
              Enjoy convenient hotel services.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 lg:px-20 pb-20">
        <div
          className="
                bg-gray-800 
                rounded-3xl 
                p-10 
                text-center 
                text-white
                "
        >
          <h2 className="text-3xl font-bold">Ready for your next adventure?</h2>

          <p className="mt-4 text-gray-300">
            Explore our hotels and find the perfect place for your stay.
          </p>

          <button
            className="
                        mt-6 
                        bg-white 
                        text-gray-800 
                        px-8 py-3 
                        rounded-full 
                        font-semibold
                        "
          >
            Explore Hotels
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
