const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export interface Hotel {
  id: number;
  name: string;
  address: string;
  location: string;
  image: string;
  price: number;
  reviews: string | null;
  rate: string | null;
  description?: string | null;
  ownerId?: number | null;
  images: string[];
  amenities: string[];
  host: {
    name: string;
    reviews: string | null;
    responseRate: string | null;
    responseTime: string | null;
  } | null;
}

export interface CreateHotelData {
  name: string;
  address?: string;
  location?: string;
  price: number;
  rate?: string;
  image?: string;
  images?: string[];
  description?: string;
}

export interface UpdateHotelData {
  name?: string;
  address?: string;
  location?: string;
  price?: number;
  rate?: string;
  image?: string;
  description?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("hotel_token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const formatHotel = (hotel: Hotel): Hotel => ({
  ...hotel,
  price: Number(hotel.price),
  rate:
    hotel.rate !== null && hotel.rate !== undefined
      ? String(hotel.rate)
      : null,
  reviews:
    hotel.reviews !== null && hotel.reviews !== undefined
      ? String(hotel.reviews)
      : null,
  images: Array.isArray(hotel.images) ? hotel.images : [],
  amenities: Array.isArray(hotel.amenities)
    ? hotel.amenities
    : [],
  host: hotel.host ?? null,
});

export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await fetch(`${API_URL}/hotels`);

    if (!response.ok) {
      throw new Error("Unable to fetch hotels.");
    }

    const data = await response.json();

    return data.map((hotel: Hotel) => formatHotel(hotel));
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
};

export const getHotelById = async (
  id: number
): Promise<Hotel | null> => {
  try {
    const response = await fetch(
      `${API_URL}/hotels/${id}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return formatHotel(data);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
};

export const getMyHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await fetch(
      `${API_URL}/hotels/my-hotels`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.message || "Unable to fetch your hotels."
      );
    }

    const data = await response.json();

    return data.map((hotel: Hotel) => formatHotel(hotel));
  } catch (error) {
    console.error("Error fetching owner's hotels:", error);
    throw error;
  }
};

export const createHotel = async (
  hotelData: CreateHotelData
): Promise<Hotel> => {
  try {
    const response = await fetch(`${API_URL}/hotels`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(hotelData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Unable to create hotel."
      );
    }

    return formatHotel(data);
  } catch (error) {
    console.error("Error creating hotel:", error);
    throw error;
  }
};

export const updateHotel = async (
  id: number,
  hotelData: UpdateHotelData
): Promise<Hotel> => {
  try {
    const response = await fetch(
      `${API_URL}/hotels/${id}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(hotelData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Unable to update hotel."
      );
    }

    return formatHotel(data);
  } catch (error) {
    console.error("Error updating hotel:", error);
    throw error;
  }
};

export const deleteHotel = async (
  id: number
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}/hotels/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || "Unable to delete hotel."
      );
    }
  } catch (error) {
    console.error("Error deleting hotel:", error);
    throw error;
  }
};