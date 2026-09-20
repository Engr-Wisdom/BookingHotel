import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  createUser,
} from "../models/authModel.ts";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      password,
      avatar,
    } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message:
          "Name, email, and password are required",
      });
      return;
    }

    const existingUser =
      await findUserByEmail(email);

    if (existingUser) {
      res.status(409).json({
        message:
          "An account with this email already exists",
      });
      return;
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      avatar,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error(
      "Error registering user:",
      error
    );

    res.status(500).json({
      message: "Failed to register user",
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message:
          "Email and password are required",
      });
      return;
    }

    const user =
      await findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        message:
          "JWT secret is not configured",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error(
      "Error logging in user:",
      error
    );

    res.status(500).json({
      message: "Failed to login",
    });
  }
};