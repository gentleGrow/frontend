"use server";

import { fetchWithTimeout, getServiceUrl } from "@/shared";
import { User } from "../types/user";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";

const getUser = async (): Promise<User | null> => {
  const response = await fetchWithTimeout(
    `${getServiceUrl()}/api/auth/v1/user`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
      },
      revalidate: 60,
    },
  );

  if (!response.ok) {
    return null;
  }

  const userData = await response.json();

  return userData;
};
export default getUser;
