"use server";
import { fetchWithTimeout, getServiceUrl } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const deleteUser = async () => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/auth/v1/user`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
        revalidate: 0,
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export default deleteUser;
