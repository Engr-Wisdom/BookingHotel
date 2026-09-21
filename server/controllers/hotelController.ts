import { Request, Response } from "express";

import {
  getAllHotels,
  getHotelById as findHotelById,
  getHotelsByOwner,
  createHotel,
  updateHotel,
  deleteHotel,
} from "../models/hotelModel.ts";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role?: string;
  };
}

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

export const getMyHotels = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "hotel_owner") {
      res.status(403).json({
        message: "Only hotel owners can access their hotels",
      });
      return;
    }

    const hotels = await getHotelsByOwner(req.user.id);

    res.json(hotels);
  } catch (error) {
    console.error("Error fetching owner's hotels:", error);

    res.status(500).json({
      message: "Failed to fetch your hotels",
    });
  }
};

export const createNewHotel = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "hotel_owner") {
      res.status(403).json({
        message: "Only hotel owners can create hotels",
      });
      return;
    }

    const {
      name,
      address,
      location,
      price,
      rate,
      image,
      description,
    } = req.body;

    if (!name || !String(name).trim()) {
      res.status(400).json({
        message: "Hotel name is required",
      });
      return;
    }

    if (
      price === undefined ||
      price === null ||
      Number.isNaN(Number(price)) ||
      Number(price) < 0
    ) {
      res.status(400).json({
        message: "A valid hotel price is required",
      });
      return;
    }

    const hotel = await createHotel({
      name: String(name).trim(),
      address: address ? String(address).trim() : undefined,
      location: location
        ? String(location).trim()
        : undefined,
      price: Number(price),
      rate: rate ? String(rate).trim() : undefined,
      image: image ? String(image).trim() : undefined,
      description: description
        ? String(description).trim()
        : undefined,
      ownerId: req.user.id,
    });

    res.status(201).json(hotel);
  } catch (error) {
    console.error("Error creating hotel:", error);

    res.status(500).json({
      message: "Failed to create hotel",
    });
  }
};

export const updateExistingHotel = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "hotel_owner") {
      res.status(403).json({
        message: "Only hotel owners can update hotels",
      });
      return;
    }

    const { id } = req.params;

    if (typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "A valid hotel ID is required",
      });
      return;
    }

    const {
      name,
      address,
      location,
      price,
      rate,
      image,
      description,
    } = req.body;

    if (
      price !== undefined &&
      (Number.isNaN(Number(price)) ||
        Number(price) < 0)
    ) {
      res.status(400).json({
        message: "Hotel price must be a valid positive number",
      });
      return;
    }

    const hotel = await updateHotel(
      id,
      req.user.id,
      {
        name:
          name !== undefined
            ? String(name).trim()
            : undefined,
        address:
          address !== undefined
            ? String(address).trim()
            : undefined,
        location:
          location !== undefined
            ? String(location).trim()
            : undefined,
        price:
          price !== undefined
            ? Number(price)
            : undefined,
        rate:
          rate !== undefined
            ? String(rate).trim()
            : undefined,
        image:
          image !== undefined
            ? String(image).trim()
            : undefined,
        description:
          description !== undefined
            ? String(description).trim()
            : undefined,
      }
    );

    if (!hotel) {
      res.status(404).json({
        message:
          "Hotel not found or you do not have permission to update it",
      });
      return;
    }

    res.json(hotel);
  } catch (error) {
    console.error("Error updating hotel:", error);

    res.status(500).json({
      message: "Failed to update hotel",
    });
  }
};

export const removeHotel = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (req.user.role !== "hotel_owner") {
      res.status(403).json({
        message: "Only hotel owners can delete hotels",
      });
      return;
    }

    const { id } = req.params;

    if (typeof id !== "string" || id.trim() === "") {
      res.status(400).json({
        message: "A valid hotel ID is required",
      });
      return;
    }

    const deleted = await deleteHotel(
      id,
      req.user.id
    );

    if (!deleted) {
      res.status(404).json({
        message:
          "Hotel not found or you do not have permission to delete it",
      });
      return;
    }

    res.json({
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);

    res.status(500).json({
      message: "Failed to delete hotel",
    });
  }
};