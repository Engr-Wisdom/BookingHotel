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
  reviews: string;
  rate: string;
  description?: string;
  images: string[];
  amenities: string[];
  host: {
    name: string;
    reviews: string | null;
    responseRate: string | null;
    responseTime: string | null;
  } | null;
}

export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await fetch(`${API_URL}/hotels`);

    if (!response.ok) {
      throw new Error("Unable to fetch hotels.");
    }

    const data = await response.json();

    return data.map((hotel: Hotel) => ({
      ...hotel,
      price: Number(hotel.price),
      rate: String(hotel.rate),
    }));
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

    return {
      ...data,
      price: Number(data.price),
      rate: String(data.rate),
    };
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
};