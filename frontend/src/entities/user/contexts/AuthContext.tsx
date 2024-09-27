import { createContext } from "react";
import { User } from "../hooks/useUser";

interface AuthContextType {
  user: User | null;
  //   login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
