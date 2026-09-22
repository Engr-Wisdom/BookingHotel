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
      phone,
      password,
      avatar,
      role,
    } = req.body;

    const email = String(
      req.body.email || ""
    ).trim().toLowerCase();

    if (!name || !email || !password || !role) {
      res.status(400).json({
        message:
          "Name, email, password, and role are required",
      });
      return;
    }

    if (
      role !== "guest" &&
      role !== "hotel_owner"
    ) {
      res.status(400).json({
        message:
          "Role must be either guest or hotel_owner",
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
      name: name.trim(),
      email,
      phone,
      password: hashedPassword,
      avatar,
      role,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
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

// export const loginUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const {
//       password,
//     } = req.body;

//     const email = String(
//       req.body.email || ""
//     ).trim().toLowerCase();

//     if (!email || !password) {
//       res.status(400).json({
//         message:
//           "Email and password are required",
//       });
//       return;
//     }

//     const user =
//       await findUserByEmail(email);

//     if (!user) {
//       res.status(401).json({
//         message: "Invalid email or password",
//       });
//       return;
//     }

//     const passwordMatch =
//       await bcrypt.compare(
//         password,
//         user.password
//       );

//     if (!passwordMatch) {
//       res.status(401).json({
//         message: "Invalid email or password",
//       });
//       return;
//     }

//     const secret =
//       process.env.JWT_SECRET;

//     if (!secret) {
//       res.status(500).json({
//         message:
//           "JWT secret is not configured",
//       });
//       return;
//     }

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: user.role,
//       },
//       secret,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.json({
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         avatar: user.avatar,
//         role: user.role,
//         createdAt: user.created_at,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error(
//       "Error logging in user:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to login",
//     });
//   }
// };


export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password } = req.body;

    const email = String(
      req.body.email || ""
    ).trim().toLowerCase();

    console.log("LOGIN EMAIL:", email);

    if (!email || !password) {
      console.log("LOGIN FAILED: Missing email or password");

      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const user = await findUserByEmail(email);

    console.log(
      "USER FOUND:",
      user ? "YES" : "NO"
    );

    if (user) {
      console.log("USER ID:", user.id);
      console.log("USER ROLE:", user.role);
      console.log(
        "PASSWORD HASH EXISTS:",
        !!user.password
      );
      console.log(
        "PASSWORD HASH LENGTH:",
        user.password?.length
      );
    }

    if (!user) {
      console.log("LOGIN FAILED: User not found");

      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "PASSWORD MATCH:",
      passwordMatch
    );

    if (!passwordMatch) {
      console.log(
        "LOGIN FAILED: Password does not match"
      );

      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    console.log(
      "JWT SECRET EXISTS:",
      !!secret
    );

    if (!secret) {
      console.log(
        "LOGIN FAILED: JWT_SECRET is missing"
      );

      res.status(500).json({
        message: "JWT secret is not configured",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    console.log("LOGIN SUCCESS");

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
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