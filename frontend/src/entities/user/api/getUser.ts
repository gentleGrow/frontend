import { fetchWithTimeout } from "@/shared";

const getUser = async () => {
  try {
    const res = await fetchWithTimeout("api/user", { method: "POST" });

    if (!res.ok) {
      return null;
      //throw new Error("로그인이 필요합니다.");
    }
    const user = await res.json();
    return user;
  } catch (error) {
    return null;
  }
};
export default getUser;
