import { SERVICE_SERVER_URL } from "@/shared";

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${SERVICE_SERVER_URL}//api/auth/v1/refresh`, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) throw new Error("서버 오류", await response.json());
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to refresh token");
  }
};
export default refreshAccessToken;
