import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  loginUser,
  registerUser,
  updateUserProfile,
} from "../api/authApi";

import type { User } from "../api/authApi";

interface AuthContextType {
  user: User | null;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  register: (
    userData: Omit<User, "id"> & {
      password: string;
    }
  ) => Promise<boolean>;

  logout: () => void;

  updateUser: (
    id: number,
    userData: Partial<User>
  ) => Promise<boolean>;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("hotel_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const loginResponse =
        await loginUser(
          email,
          password
        );

      if (!loginResponse) {
        return false;
      }

      const { user, token } =
        loginResponse;

      setUser(user);

      localStorage.setItem(
        "hotel_user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "hotel_token",
        token
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const register = async (
    userData: Omit<User, "id"> & {
      password: string;
    }
  ): Promise<boolean> => {
    try {
      await registerUser(userData);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const updateUser = async (
    id: number,
    userData: Partial<User>
  ): Promise<boolean> => {
    try {
      const updatedUser =
        await updateUserProfile(
          id,
          userData
        );

      setUser(updatedUser);

      localStorage.setItem(
        "hotel_user",
        JSON.stringify(updatedUser)
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      "hotel_user"
    );

    localStorage.removeItem(
      "hotel_token"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};