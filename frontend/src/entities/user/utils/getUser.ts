"use server";
import { getAccessToken, getRefreshToken } from "@/shared";
import refreshAccessToken from "../api/refreshAccessToken";

const getUser = () => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No token found");
      }
      const newAccessToken = refreshAccessToken(refreshToken);
      return { isLoggedIn: true };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
export default getUser;
