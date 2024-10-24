"use server";
import { SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const checkValidateNickname = async (nickname: string) => {
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
    return await response.json().then((data) => data.isValidatedNickname);
  } catch (error) {
    console.error(error);
    return false;
  }
};
export default checkValidateNickname;
