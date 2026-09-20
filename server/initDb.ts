import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        location TEXT,
        reviews VARCHAR(100),
        price NUMERIC(10, 2) NOT NULL,
        rate NUMERIC(3, 1),
        image TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS hotel_images (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS hotel_amenities (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
        amenity VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS hosts (
        id SERIAL PRIMARY KEY,
        hotel_id INTEGER UNIQUE REFERENCES hotels(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        reviews VARCHAR(100),
        response_rate VARCHAR(50),
        response_time VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
        hotel_name VARCHAR(255),
        image TEXT,
        location TEXT,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending'
      );
    `);

    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await pool.end();
  }
};

createTables();