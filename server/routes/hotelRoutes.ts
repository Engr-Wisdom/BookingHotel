import express from "express";

import {
  getHotels,
  getHotelById,
  getMyHotels,
  createNewHotel,
  updateExistingHotel,
  removeHotel,
} from "../controllers/hotelController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = express.Router();

// Public routes
router.get("/", getHotels);

// Hotel owner routes
// Keep this before /:id so "my-hotels" is not treated as a hotel ID.
router.get("/my-hotels", authMiddleware, getMyHotels);

router.post("/", authMiddleware, createNewHotel);

router.patch("/:id", authMiddleware, updateExistingHotel);

router.delete("/:id", authMiddleware, removeHotel);

// Public hotel details route
router.get("/:id", getHotelById);

export default router;