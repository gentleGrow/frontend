"use server";
import { SERVICE_SERVER_URL } from "@/shared";

const checkValidateNickname = async (nickname: string) => {
  try {
    const response = await fetch(
      `${SERVICE_SERVER_URL}/api/auth/v1/nickname?nickname=${nickname}`,
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("data ", data, nickname);
    return data.isUsed;
  } catch (error) {
    console.error(error);
    return true;
  }
};
export default checkValidateNickname;
