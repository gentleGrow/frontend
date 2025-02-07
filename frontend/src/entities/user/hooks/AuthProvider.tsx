"use client";
import getUser from "@/entities/user/api/getUser";
import React, { createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/entities";

interface AuthContextType {
  user: User | null;
  initializeUser: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const { mutate: initializeUser, isPending: isPendingInitializeUser } =
    useMutation({ mutationFn: () => originInitializeUser() });

  const originInitializeUser = async () => {
    const user = await getUser();
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <AuthContext.Provider
      value={{ user, initializeUser: originInitializeUser, logout }}
    >
      {!isPendingInitializeUser && children}
    </AuthContext.Provider>
  );
}
