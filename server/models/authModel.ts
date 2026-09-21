import pool from "../config/db.ts";

export type UserRole =
  | "guest"
  | "hotel_owner";

export interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  role: UserRole;
}

export const findUserByEmail = async (
  email: string
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      password,
      avatar,
      role,
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
    role,
  } = userData;

  const result = await pool.query(
    `
    INSERT INTO users (
      name,
      email,
      phone,
      password,
      avatar,
      role
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      name,
      email,
      phone,
      avatar,
      role,
      created_at
    `,
    [
      name,
      email,
      phone || null,
      password,
      avatar || null,
      role,
    ]
  );

  return result.rows[0];
};