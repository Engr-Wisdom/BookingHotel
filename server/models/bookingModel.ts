import pool from "../config/db.ts";

export interface CreateBookingData {
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

export const createBooking = async (
  bookingData: CreateBookingData
) => {
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
  } = bookingData;

  const result = await pool.query(
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

  return result.rows[0];
};

export const getBookingsByUserId = async (
  userId: string
) => {
  const result = await pool.query(
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

  return result.rows;
};

export const getBookingById = async (
  id: string
) => {
  const result = await pool.query(
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

  return result.rows[0] || null;
};

export const updateBookingStatus = async (
  id: string,
  status: string
) => {
  const result = await pool.query(
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

  return result.rows[0] || null;
};