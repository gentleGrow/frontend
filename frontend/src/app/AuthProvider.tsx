"use client";
import { AuthContext, User } from "@/entities";
import getUser from "@/entities/user/api/getUser";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

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

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <AuthContext.Provider value={{ user, initializeUser }}>
      {!isPendingInitializeUser && children}
    </AuthContext.Provider>
  );
}
