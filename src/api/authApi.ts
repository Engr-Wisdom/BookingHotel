export type UserRole =
  | "guest"
  | "hotel_owner";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export const registerUser = async (
  user: Omit<User, "id"> & {
    password: string;
  }
): Promise<User> => {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to register user"
    );
  }

  return data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse | null> => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || "Login failed"
    );
  }

  return data;
};

export const getUserProfile = async (
  id: number
): Promise<User | null> => {
  const token =
    localStorage.getItem("hotel_token");

  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      "Failed to fetch user profile"
    );
  }

  return response.json();
};

export const updateUserProfile = async (
  id: number,
  userData: Partial<User>
): Promise<User> => {
  const token =
    localStorage.getItem("hotel_token");

  const response = await fetch(
    `${API_URL}/users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Failed to update profile"
    );
  }

  return data;
};