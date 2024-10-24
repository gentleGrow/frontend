"use server";
import { SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const updateNickname = async (nickname: string) => {
  try {
    const response = await fetch(`${SERVICE_SERVER_URL}/api/auth/v1/nickname`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
      },
      body: JSON.stringify({ nickname }),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
};
export default updateNickname;
