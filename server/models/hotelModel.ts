import pool from "../config/db.ts";

export interface CreateHotelData {
  name: string;
  address?: string;
  location?: string;
  price: number;
  rate?: string;
  image?: string;
  images: string[];
  description?: string;
  ownerId: number;
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
  owner_id: number | null;
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

const formatHotel = (hotel: HotelRow) => ({
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
  ownerId: hotel.owner_id,
});

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
      h.description,
      h.owner_id
    FROM hotels h
    ORDER BY h.id
  `);

  return result.rows.map(formatHotel);
};

export const getHotelsByOwner = async (
  ownerId: number
) => {
  const result = await pool.query<HotelRow>(
    `
    SELECT
      h.id,
      h.name,
      h.address,
      h.location,
      h.reviews,
      h.price,
      h.rate,
      h.image,
      h.description,
      h.owner_id
    FROM hotels h
    WHERE h.owner_id = $1
    ORDER BY h.id DESC
    `,
    [ownerId]
  );

  return result.rows.map(formatHotel);
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
      description,
      owner_id
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
    ownerId: hotel.owner_id,

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

export const createHotel = async (
  hotelData: CreateHotelData
) => {
  const {
    name,
    address,
    location,
    price,
    rate,
    image,
    description,
    ownerId,
  } = hotelData;

  const result = await pool.query<HotelRow>(
    `
    INSERT INTO hotels (
      name,
      address,
      location,
      price,
      rate,
      image,
      description,
      owner_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id,
      name,
      address,
      location,
      reviews,
      price,
      rate,
      image,
      description,
      owner_id
    `,
    [
      name,
      address || null,
      location || null,
      price,
      rate || null,
      image || null,
      description || null,
      ownerId,
    ]
  );

  return formatHotel(result.rows[0]);
};

export const updateHotel = async (
  id: string,
  ownerId: number,
  hotelData: UpdateHotelData
) => {
  const {
    name,
    address,
    location,
    price,
    rate,
    image,
    description,
  } = hotelData;

  const result = await pool.query<HotelRow>(
    `
    UPDATE hotels
    SET
      name = COALESCE($1, name),
      address = COALESCE($2, address),
      location = COALESCE($3, location),
      price = COALESCE($4, price),
      rate = COALESCE($5, rate),
      image = COALESCE($6, image),
      description = COALESCE($7, description)
    WHERE id = $8
      AND owner_id = $9
    RETURNING
      id,
      name,
      address,
      location,
      reviews,
      price,
      rate,
      image,
      description,
      owner_id
    `,
    [
      name ?? null,
      address ?? null,
      location ?? null,
      price ?? null,
      rate ?? null,
      image ?? null,
      description ?? null,
      id,
      ownerId,
    ]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return formatHotel(result.rows[0]);
};

export const deleteHotel = async (
  id: string,
  ownerId: number
) => {
  const result = await pool.query(
    `
    DELETE FROM hotels
    WHERE id = $1
      AND owner_id = $2
    RETURNING id
    `,
    [id, ownerId]
  );

  return result.rows.length > 0;
}; 