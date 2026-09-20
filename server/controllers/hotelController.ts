import { Request, Response } from "express";

import {
  getAllHotels,
  getHotelById as findHotelById,
} from "../models/hotelModel.ts";

export const getHotels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hotels = await getAllHotels();

    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);

    res.status(500).json({
      message: "Failed to fetch hotels",
    });
  }
};

export const getHotelById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Express can type route parameters as string | string[].
    // We only accept a single string ID.
    if (typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "A valid hotel ID is required",
      });
      return;
    }

    const hotel = await findHotelById(id);

    if (!hotel) {
      res.status(404).json({
        message: "Hotel not found",
      });
      return;
    }

    res.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);

    res.status(500).json({
      message: "Failed to fetch hotel",
    });
  }
};