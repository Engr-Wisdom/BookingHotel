import express from "express";

import {
  createBooking,
  getBookingsByUser,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.post("/", authMiddleware, createBooking);

router.get("/user/:userId", authMiddleware, getBookingsByUser);

router.get("/:id", authMiddleware, getBookingById);

router.patch("/:id/status", authMiddleware, updateBookingStatus);

router.delete("/:id", authMiddleware, deleteBooking);

export default router;