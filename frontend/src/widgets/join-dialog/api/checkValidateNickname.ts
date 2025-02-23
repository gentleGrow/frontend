"use server";
import { fetchWithTimeout, getServiceUrl } from "@/shared";

const checkValidateNickname = async (nickname: string) => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/auth/v1/nickname?nickname=${nickname}`,
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.isUsed;
  } catch (error) {
    console.error(error);
    return true;
  }
};
export default checkValidateNickname;
