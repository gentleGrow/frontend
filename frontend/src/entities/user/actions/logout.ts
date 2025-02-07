"use server";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

const logout = async () => {
  try {
    const cookieStore = cookies();
    cookieStore.delete(ACCESS_TOKEN);
    cookieStore.delete(REFRESH_TOKEN);
  } catch (error) {
    console.error("로그아웃 중 에러가 발생했습니다.", error);
  }
};
export default logout;
