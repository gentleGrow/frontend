"use server";
import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";
import { User } from "../types/user";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";

const getUser = async (): Promise<User | null> => {
  try {
    const response = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/auth/v1/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
export default getUser;
