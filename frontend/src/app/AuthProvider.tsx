"use client";
import { AuthContext, logout as logoutUser, User } from "@/entities";
import getUser from "@/entities/user/api/getUser";
import React, { useEffect, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
    logoutUser();
  };
  const initializeUser = async () => {
    const user = await getUser();
    setUser(user);
  };
  useEffect(() => {
    initializeUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, initializeUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
