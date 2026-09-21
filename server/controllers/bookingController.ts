import { Request, Response } from "express";
import pool from "../config/db.ts";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role?: string;
  };
}

interface BookingRow {
  id: number;
  user_id: number;
  hotel_id: number;
  hotel_name: string | null;
  image: string | null;
  location: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: string | number;
  status: string;
}

interface CreateBookingBody {
  userId: number;
  hotelId: number;
  hotelName?: string;
  image?: string;
  location?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status?: string;
}

const formatBooking = (booking: BookingRow) => ({
  id: booking.id,
  userId: booking.user_id,
  hotelId: booking.hotel_id,
  hotelName: booking.hotel_name,
  image: booking.image,
  location: booking.location,
  checkIn: booking.check_in,
  checkOut: booking.check_out,
  guests: booking.guests,
  totalPrice: Number(booking.total_price),
  status: booking.status,
});

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      hotelId,
      hotelName,
      image,
      location,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status,
    } = req.body as CreateBookingBody;

    if (
      !userId ||
      !hotelId ||
      !checkIn ||
      !checkOut ||
      !guests ||
      totalPrice === undefined
    ) {
      res.status(400).json({
        message: "Missing required booking information",
      });
      return;
    }

    const result = await pool.query<BookingRow>(
      `
      INSERT INTO bookings (
        user_id,
        hotel_id,
        hotel_name,
        image,
        location,
        check_in,
        check_out,
        guests,
        total_price,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      RETURNING
        id,
        user_id,
        hotel_id,
        hotel_name,
        image,
        location,
        check_in,
        check_out,
        guests,
        total_price,
        status
      `,
      [
        userId,
        hotelId,
        hotelName || null,
        image || null,
        location || null,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status || "Pending",
      ]
    );

    const booking = result.rows[0];

    res.status(201).json(formatBooking(booking));
  } catch (error) {
    console.error("Error creating booking:", error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
};

export const getBookingsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const result = await pool.query<BookingRow>(
      `
      SELECT
        id,
        user_id,
        hotel_id,
        hotel_name,
        image,
        location,
        check_in,
        check_out,
        guests,
        total_price,
        status
      FROM bookings
      WHERE user_id = $1
      ORDER BY id DESC
      `,
      [userId]
    );

    const bookings = result.rows.map(
      (booking: BookingRow) => formatBooking(booking)
    );

    res.json(bookings);
  } catch (error) {
    console.error(
      "Error fetching user bookings:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

export const getBookingsByOwner = async (
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
        message: "Access denied. Hotel owner account required.",
      });
      return;
    }

    const result = await pool.query<BookingRow>(
      `
      SELECT
        b.id,
        b.user_id,
        b.hotel_id,
        b.hotel_name,
        b.image,
        b.location,
        b.check_in,
        b.check_out,
        b.guests,
        b.total_price,
        b.status
      FROM bookings b
      INNER JOIN hotels h
        ON b.hotel_id = h.id
      WHERE h.owner_id = $1
      ORDER BY b.id DESC
      `,
      [req.user.id]
    );

    const bookings = result.rows.map(
      (booking: BookingRow) => formatBooking(booking)
    );

    res.json(bookings);
  } catch (error) {
    console.error(
      "Error fetching hotel owner bookings:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch owner bookings",
    });
  }
};

export const getBookingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query<BookingRow>(
      `
      SELECT
        id,
        user_id,
        hotel_id,
        hotel_name,
        image,
        location,
        check_in,
        check_out,
        guests,
        total_price,
        status
      FROM bookings
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Booking not found",
      });
      return;
    }

    const booking = result.rows[0];

    res.json(formatBooking(booking));
  } catch (error) {
    console.error("Error fetching booking:", error);

    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

export const updateBookingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as {
      status?: string;
    };

    if (!status) {
      res.status(400).json({
        message: "Booking status is required",
      });
      return;
    }

    const result = await pool.query<BookingRow>(
      `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        user_id,
        hotel_id,
        hotel_name,
        image,
        location,
        check_in,
        check_out,
        guests,
        total_price,
        status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Booking not found",
      });
      return;
    }

    const booking = result.rows[0];

    res.json(formatBooking(booking));
  } catch (error) {
    console.error("Error updating booking:", error);

    res.status(500).json({
      message: "Failed to update booking",
    });
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM bookings
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Booking not found",
      });
      return;
    }

    res.status(200).json({
      message: "Booking deleted successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting booking:", error);

    res.status(500).json({
      message: "Failed to delete booking",
    });
  }
};