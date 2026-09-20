import express from "express";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.ts";

import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.get(
  "/:id",
  authMiddleware,
  getUserProfile
);

router.patch(
  "/:id",
  authMiddleware,
  updateUserProfile
);

export default router;