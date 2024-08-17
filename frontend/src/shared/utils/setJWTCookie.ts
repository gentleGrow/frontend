"use server";

import { cookies } from "next/headers";

const setJWTCookie = (access_token: string, refresh_token: string) => {
  const cookieStore = cookies();
  cookieStore.set("accessToken", access_token, {
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });
  cookieStore.set("refrechToken", refresh_token, {
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });
};
export default setJWTCookie;
