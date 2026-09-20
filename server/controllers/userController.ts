import { Request, Response } from "express";

import {
  findUserById,
  updateUser,
  findUserByEmailExceptId,
} from "../models/userModel.ts";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "A valid user ID is required",
      });
      return;
    }

    const user = await findUserById(id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch user profile",
    });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "A valid user ID is required",
      });
      return;
    }

    const {
      name,
      email,
      phone,
      avatar,
    } = req.body;

    if (
      name === undefined &&
      email === undefined &&
      phone === undefined &&
      avatar === undefined
    ) {
      res.status(400).json({
        message:
          "No profile information was provided",
      });
      return;
    }

    if (email) {
      const existingUser =
        await findUserByEmailExceptId(
          email,
          id
        );

      if (existingUser) {
        res.status(409).json({
          message:
            "An account with this email already exists",
        });
        return;
      }
    }

    const user = await updateUser(id, {
      name,
      email,
      phone,
      avatar,
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error(
      "Error updating user profile:",
      error
    );

    res.status(500).json({
      message: "Failed to update user profile",
    });
  }
};