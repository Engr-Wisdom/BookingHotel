import pool from "../config/db.ts";

interface HotelRow {
  id: number;
  name: string;
  address: string | null;
  location: string | null;
  reviews: string | null;
  price: string | number;
  rate: string | number | null;
  image: string | null;
  description: string | null;
}

interface ImageRow {
  image_url: string;
}

interface AmenityRow {
  amenity: string;
}

interface HostRow {
  name: string;
  reviews: string | null;
  response_rate: string | null;
  response_time: string | null;
}

export const getAllHotels = async () => {
  const result = await pool.query<HotelRow>(`
    SELECT
      h.id,
      h.name,
      h.address,
      h.location,
      h.reviews,
      h.price,
      h.rate,
      h.image,
      h.description
    FROM hotels h
    ORDER BY h.id
  `);

  return result.rows.map((hotel: HotelRow) => ({
    ...hotel,
    price: Number(hotel.price),
    rate:
      hotel.rate !== null
        ? String(hotel.rate)
        : null,
  }));
};

export const getHotelById = async (id: string) => {
  const hotelResult = await pool.query<HotelRow>(
    `
    SELECT
      id,
      name,
      address,
      location,
      reviews,
      price,
      rate,
      image,
      description
    FROM hotels
    WHERE id = $1
    `,
    [id]
  );

  if (hotelResult.rows.length === 0) {
    return null;
  }

  const hotel = hotelResult.rows[0];

  const imagesResult = await pool.query<ImageRow>(
    `
    SELECT image_url
    FROM hotel_images
    WHERE hotel_id = $1
    ORDER BY id
    `,
    [id]
  );

  const amenitiesResult = await pool.query<AmenityRow>(
    `
    SELECT amenity
    FROM hotel_amenities
    WHERE hotel_id = $1
    ORDER BY id
    `,
    [id]
  );

  const hostResult = await pool.query<HostRow>(
    `
    SELECT
      name,
      reviews,
      response_rate,
      response_time
    FROM hosts
    WHERE hotel_id = $1
    `,
    [id]
  );

  return {
    id: hotel.id,
    name: hotel.name,
    address: hotel.address,
    location: hotel.location,
    reviews: hotel.reviews,
    price: Number(hotel.price),
    rate:
      hotel.rate !== null
        ? String(hotel.rate)
        : null,
    image: hotel.image,
    description: hotel.description,

    images: imagesResult.rows.map(
      (item: ImageRow) => item.image_url
    ),

    amenities: amenitiesResult.rows.map(
      (item: AmenityRow) => item.amenity
    ),

    host:
      hostResult.rows.length > 0
        ? {
            name: hostResult.rows[0].name,
            reviews: hostResult.rows[0].reviews,
            responseRate:
              hostResult.rows[0].response_rate,
            responseTime:
              hostResult.rows[0].response_time,
          }
        : null,
  };
};