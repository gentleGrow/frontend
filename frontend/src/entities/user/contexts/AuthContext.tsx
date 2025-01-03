"use client";
import { createContext } from "react";
import { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  logout: () => void;
  initializeUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
