"use server";
import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const updateNickname = async (nickname: string) => {
  try {
    const response = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/auth/v1/nickname`,
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

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error(error);
    return false;
  }
};
export default updateNickname;
