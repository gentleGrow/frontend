"use server";
import { fetchWithTimeout, getServiceUrl } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const updateNickname = async (nickname: string) => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/auth/v1/nickname`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
        body: JSON.stringify({ nickname }),
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    return false;
  }
  revalidatePath("/", "layout");
  return true;
};
export default updateNickname;
