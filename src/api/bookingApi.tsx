export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  hotelName: string;
  image: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
}

// Data required when creating a booking
// id is generated automatically by PostgreSQL
export type CreateBookingData = Omit<Booking, "id">;

// Express API
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// Get authentication token
const getAuthHeaders = () => {
  const token = localStorage.getItem("hotel_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Create Booking
export const createBooking = async (
  bookingData: CreateBookingData
): Promise<Booking> => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create booking"
    );
  }

  return data;
};

// Get all bookings for a specific user
export const getBookingsByUser = async (
  userId: number
): Promise<Booking[]> => {
  const response = await fetch(
    `${API_URL}/bookings/user/${userId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch bookings"
    );
  }

  return data;
};

// Get all bookings for the logged-in hotel owner
export const getBookingsByOwner = async (): Promise<Booking[]> => {
  const response = await fetch(
    `${API_URL}/bookings/owner`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch owner bookings"
    );
  }

  return data;
};

// Get a single booking by id
export const getBookingById = async (
  id: number
): Promise<Booking | null> => {
  const response = await fetch(
    `${API_URL}/bookings/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch booking"
    );
  }

  return data;
};

// Update booking status
export const updateBookingStatus = async (
  id: number,
  status: string
): Promise<Booking> => {
  const response = await fetch(
    `${API_URL}/bookings/${id}/status`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update booking status"
    );
  }

  return data;
};

// Delete booking
export const deleteBooking = async (
  id: number
): Promise<boolean> => {
  const response = await fetch(
    `${API_URL}/bookings/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete booking"
    );
  }

  return true;
};