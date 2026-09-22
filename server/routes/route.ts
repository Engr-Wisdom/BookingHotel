import express from "express";

import authRoutes from "./authRoutes.ts";
import hotelRoutes from "./hotelRoutes.ts";
import userRoutes from "./userRoutes.ts";
import bookingRoutes from "./bookingRoutes.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "BookingHotel API is running",
  });
});

router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);
router.use("/users", userRoutes);
router.use("/bookings", bookingRoutes);

export default router;