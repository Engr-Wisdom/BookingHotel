import pool from "../config/db.ts";

export interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
}

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      password,
      avatar,
      created_at
    FROM users
    WHERE LOWER(email) = LOWER($1)
    `,
    [email]
  );

  return result.rows[0] || null;
};

export const createUser = async (
  userData: CreateUserData
) => {
  const {
    name,
    email,
    phone,
    password,
    avatar,
  } = userData;

  const result = await pool.query(
    `
    INSERT INTO users (
      name,
      email,
      phone,
      password,
      avatar
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      name,
      email,
      phone,
      avatar,
      created_at
    `,
    [
      name,
      email,
      phone || null,
      password,
      avatar || null,
    ]
  );

  return result.rows[0];
};