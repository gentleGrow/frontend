"use client";
import { AuthContext, User } from "@/entities";
import React, { PropsWithChildren, useState } from "react";

interface AuthProviderProps extends PropsWithChildren {
  user: User | null;
}

export default function AuthProvider({
  children,
  user: initialUserState,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUserState);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
