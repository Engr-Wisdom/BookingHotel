import dotenv from "dotenv";
import pg from "pg";
import fs from "fs";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
}

interface Host {
  name: string;
  reviews?: string;
  responseRate?: string;
  responseTime?: string;
}

interface Hotel {
  id: number;
  name: string;
  address?: string;
  location?: string;
  reviews?: string;
  price: number;
  rate: number;
  image?: string;
  description?: string;
  images?: string[];
  amenities?: string[];
  host?: Host;
}

interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  hotelName?: string;
  image?: string;
  location?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
}

interface Database {
  users: User[];
  hotels: Hotel[];
  bookings: Booking[];
}

const db: Database = JSON.parse(
  fs.readFileSync(
    new URL("./db.json", import.meta.url),
    "utf-8"
  )
);

const migrateData = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Starting data...");

    // -------------------------
    // 1. USERS
    // -------------------------

    const userIdMap = new Map<number, number>();

    for (const user of db.users) {
      const result = await client.query<{ id: number }>(
        `
        INSERT INTO users (
          name,
          email,
          phone,
          password
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email)
        DO UPDATE SET
          name = EXCLUDED.name,
          phone = EXCLUDED.phone
        RETURNING id
        `,
        [
          user.name,
          user.email,
          user.phone ?? null,
          user.password,
        ]
      );

      userIdMap.set(user.id, result.rows[0].id);
    }

    console.log("Users.");

    // -------------------------
    // 2. HOTELS
    // -------------------------

    const hotelIdMap = new Map<number, number>();

    for (const hotel of db.hotels) {
      const result = await client.query<{ id: number }>(
        `
        INSERT INTO hotels (
          id,
          name,
          address,
          location,
          reviews,
          price,
          rate,
          image,
          description
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
          $9
        )
        ON CONFLICT (id)
        DO UPDATE SET
          name = EXCLUDED.name,
          address = EXCLUDED.address,
          location = EXCLUDED.location,
          reviews = EXCLUDED.reviews,
          price = EXCLUDED.price,
          rate = EXCLUDED.rate,
          image = EXCLUDED.image,
          description = EXCLUDED.description
        RETURNING id
        `,
        [
          hotel.id,
          hotel.name,
          hotel.address ?? null,
          hotel.location ?? null,
          hotel.reviews ?? null,
          hotel.price,
          hotel.rate,
          hotel.image ?? null,
          hotel.description ?? null,
        ]
      );

      const hotelId = result.rows[0].id;

      hotelIdMap.set(hotel.id, hotelId);

      // -------------------------
      // HOTEL IMAGES
      // -------------------------

      for (const image of hotel.images ?? []) {
        const existingImage = await client.query<{ id: number }>(
          `
          SELECT id
          FROM hotel_images
          WHERE hotel_id = $1
          AND image_url = $2
          `,
          [hotelId, image]
        );

        if (existingImage.rows.length === 0) {
          await client.query(
            `
            INSERT INTO hotel_images (
              hotel_id,
              image_url
            )
            VALUES ($1, $2)
            `,
            [hotelId, image]
          );
        }
      }

      // -------------------------
      // AMENITIES
      // -------------------------

      for (const amenity of hotel.amenities ?? []) {
        const existingAmenity = await client.query<{ id: number }>(
          `
          SELECT id
          FROM hotel_amenities
          WHERE hotel_id = $1
          AND amenity = $2
          `,
          [hotelId, amenity]
        );

        if (existingAmenity.rows.length === 0) {
          await client.query(
            `
            INSERT INTO hotel_amenities (
              hotel_id,
              amenity
            )
            VALUES ($1, $2)
            `,
            [hotelId, amenity]
          );
        }
      }

      // -------------------------
      // HOST
      // -------------------------

      if (hotel.host) {
        await client.query(
          `
          INSERT INTO hosts (
            hotel_id,
            name,
            reviews,
            response_rate,
            response_time
          )
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (hotel_id)
          DO UPDATE SET
            name = EXCLUDED.name,
            reviews = EXCLUDED.reviews,
            response_rate = EXCLUDED.response_rate,
            response_time = EXCLUDED.response_time
          `,
          [
            hotelId,
            hotel.host.name,
            hotel.host.reviews ?? null,
            hotel.host.responseRate ?? null,
            hotel.host.responseTime ?? null,
          ]
        );
      }
    }

    console.log("Hotels.");

    // -------------------------
    // 3. BOOKINGS
    // -------------------------

    for (const booking of db.bookings) {
      const userId = userIdMap.get(booking.userId);
      const hotelId = hotelIdMap.get(booking.hotelId);

      if (!userId || !hotelId) {
        console.log(
          `Skipping booking ${booking.id}: user or hotel not found.`
        );
        continue;
      }

      await client.query(
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
        `,
        [
          userId,
          hotelId,
          booking.hotelName ?? null,
          booking.image ?? null,
          booking.location ?? null,
          booking.checkIn,
          booking.checkOut,
          booking.guests,
          booking.totalPrice,
          booking.status,
        ]
      );
    }

    console.log("Bookings.");

    await client.query("COMMIT");

    console.log("Data completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Data migration failed:");
    console.error(error);
  } finally {
    client.release();
    await pool.end();
  }
};

migrateData();