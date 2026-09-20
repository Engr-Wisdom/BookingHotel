import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import Map from "../components/Map";

const Contact = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="px-10 pt-32 pb-20 lg:px-20">
        {/* Hero Section */}

        <div className="rounded-3xl bg-gray-800 px-8 py-20 text-center text-white">
          <h1 className="text-4xl font-bold lg:text-5xl">Get in Touch</h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-300">
            Have questions about bookings, reservations, or your next stay? Our
            team is always available to help you.
          </p>
        </div>

        {/* Contact Section */}

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Side */}

          <div className="rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-800">
              Contact Information
            </h2>

            <p className="mt-3 text-gray-500">
              We'd love to hear from you. Reach out to us through any of the
              channels below.
            </p>

            <div className="mt-10 space-y-8">
              <div className="rounded-2xl bg-gray-100 p-5">
                <div className="flex items-center gap-1 text-lg font-semibold">
                  <img src={assets.locationIcon} alt="" /> <h2>Address</h2>
                </div>

                <p className="mt-2 text-gray-600">
                  Los Angeles, California, USA
                </p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-5">
                <h3 className="text-lg font-semibold">📞 Phone</h3>

                <p className="mt-2 text-gray-600">+1 555 123 4567</p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-5">
                <h3 className="text-lg font-semibold">✉️ Email</h3>

                <p className="mt-2 text-gray-600">support@quickstay.com</p>
              </div>

              <div className="rounded-2xl bg-gray-100 p-5">
                <h3 className="text-lg font-semibold">🕒 Working Hours</h3>

                <p className="mt-2 text-gray-600">
                  Monday – Sunday
                  <br />
                  Open 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-800">
              Send us a message
            </h2>

            <p className="mt-3 text-gray-500">
              Fill in the form below, and our team will contact you shortly.
            </p>

            <form className="mt-8 space-y-5">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-700"
              />

              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-700"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-700"
              />

              <textarea
                rows={6}
                placeholder="Write your message here..."
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-700"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-gray-800 py-4 font-semibold text-white transition hover:bg-gray-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}

        <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-md">
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Find Us on the Map
            </h2>

            <p className="mt-2 text-gray-500">
              Visit us and experience comfort like never before.
            </p>
          </div>

          <div
  className="
    mt-12
    overflow-hidden
    rounded-3xl
    bg-white
    p-3
    shadow-lg
    transition-all
    duration-300
    hover:shadow-2xl
  "
>
  <div className="mb-5">
    <h2 className="text-3xl font-bold text-gray-800">
      Location on Map
    </h2>

    <p className="mt-2 text-gray-500">
      Exact location provided after booking.
    </p>
  </div>

  <div className="overflow-hidden rounded-2xl">
    <Map />
  </div>

  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-100 p-4">
    <img src={assets.locationIcon} alt="Location" className="text-xl" />

    <div>
      <h3 className="font-semibold text-gray-800">
        Los Angeles, California, USA
      </h3>

      <p className="text-sm text-gray-500">
        Experience comfort like never before.
      </p>
    </div>
  </div>
</div>
        </div>

        {/* Call To Action */}

        <div className="mt-12 rounded-3xl bg-gray-800 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold lg:text-4xl">
            Your next adventure starts here
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-300">
            Discover luxurious rooms, breathtaking destinations, and
            unforgettable experiences with QuickStay.
          </p>

          <button className="mt-8 rounded-full bg-white px-8 py-3 font-semibold text-gray-800 transition hover:scale-105">
            Explore Hotels
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
