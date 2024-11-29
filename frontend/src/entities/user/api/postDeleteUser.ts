"use server";
import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const postDeleteUser = async (reason: string) => {
  try {
    const res = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/auth/v1/user/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
        },
        body: JSON.stringify({ reason }),
      },
    );
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    revalidatePath("/", "layout");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default postDeleteUser;
