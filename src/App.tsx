import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/Home"));
const Hotels = lazy(() => import("./pages/Hotels"));
const About = lazy(() => import("./pages/About"));
const HotelDetails = lazy(() => import("./pages/HotelDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const MyBooking = lazy(() => import("./pages/MyBooking"));
const Booking = lazy(() => import("./pages/Booking"));
const HotelDashboard = lazy(() => import("./pages/HotelDashboard"));
const AddHotel = lazy(() => import("./pages/AddHotel"));
const MyHotels = lazy(() => import("./pages/MyHotels"));
const HotelBookings = lazy(() => import("./pages/HotelBookings"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"></div>

            <p className="mt-4 text-gray-500">
              Loading page...
            </p>
          </div>
        </div>
      }
    >
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/hotels" element={<Hotels />} />

        <Route path="/about" element={<About />} />

        <Route
          path="/hotel/:id"
          element={<HotelDetails />}
        />

        <Route path="/contact" element={<Contact />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/edit-profile"
          element={<EditProfile />}
        />

        <Route
          path="/my-bookings"
          element={<MyBooking />}
        />

        <Route
          path="/booking/:id"
          element={<Booking />}
        />

        <Route
          path="/hotel-dashboard"
          element={<HotelDashboard />}
        />

        <Route
          path="/add-hotel"
          element={<AddHotel />}
        />

        <Route
          path="/my-hotels"
          element={<MyHotels />}
        />

        <Route
          path="/hotel-bookings"
          element={<HotelBookings />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;