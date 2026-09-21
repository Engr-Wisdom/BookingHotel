import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "guest" | "hotel_owner";
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        message: "JWT secret is not configured",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      role: "guest" | "hotel_owner";
    };

    if (
      typeof decoded.id !== "number" ||
      (decoded.role !== "guest" && decoded.role !== "hotel_owner")
    ) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
      return;
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};