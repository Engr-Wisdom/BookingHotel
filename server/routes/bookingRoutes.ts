import express from "express";

import {
  createBooking,
  getBookingsByUser,
  getBookingsByOwner,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.post("/", authMiddleware, createBooking);

router.get("/user/:userId", authMiddleware, getBookingsByUser);

// Hotel owner bookings
// Keep this before /:id so "owner" is not treated as a booking ID.
router.get("/owner", authMiddleware, getBookingsByOwner);

router.get("/:id", authMiddleware, getBookingById);

router.patch("/:id/status", authMiddleware, updateBookingStatus);

router.delete("/:id", authMiddleware, deleteBooking);

export default router;