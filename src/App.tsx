import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import About from "./pages/About";
import HotelDetails from "./pages/HotelDetails";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyBooking from "./pages/MyBooking";
import Booking from "./pages/Booking";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/hotels" element={<Hotels />} />

      <Route path="/about" element={<About />} />

      <Route path="/hotel/:id" element={<HotelDetails />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/edit-profile" element={<EditProfile />} />

      <Route path="/my-bookings" element={<MyBooking />} />

      <Route path="/booking/:id" element={<Booking />} />
    </Routes>
  );
}

export default App;
