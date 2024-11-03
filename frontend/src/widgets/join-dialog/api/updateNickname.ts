"use server";
import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const updateNickname = async (nickname: string) => {
  try {
    console.log("nickname", nickname);
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
    console.log("response", response);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("회원가입 오류 발생", error);
    return false;
  }
  revalidatePath("/", "layout");
  return true;
};
export default updateNickname;
