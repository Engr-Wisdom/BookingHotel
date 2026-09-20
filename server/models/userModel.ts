import pool from "../config/db.ts";

export const findUserById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      avatar,
      created_at
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
};

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export const updateUser = async (
  id: string,
  userData: UpdateUserData
) => {
  const {
    name,
    email,
    phone,
    avatar,
  } = userData;

  const result = await pool.query(
    `
    UPDATE users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      avatar = COALESCE($4, avatar)
    WHERE id = $5
    RETURNING
      id,
      name,
      email,
      phone,
      avatar,
      created_at
    `,
    [
      name ?? null,
      email ?? null,
      phone ?? null,
      avatar ?? null,
      id,
    ]
  );

  return result.rows[0] || null;
};

export const findUserByEmailExceptId = async (
  email: string,
  id: string
) => {
  const result = await pool.query(
    `
    SELECT id
    FROM users
    WHERE LOWER(email) = LOWER($1)
    AND id != $2
    `,
    [email, id]
  );

  return result.rows[0] || null;
};