"use server";
import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken;
};

export const getRefreshToken = async () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  return refreshToken;
};
