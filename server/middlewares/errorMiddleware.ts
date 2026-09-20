import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Server Error:", error);

  res.status(500).json({
    message: "Internal server error",
  });
};