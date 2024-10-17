// import { fetchWithTimeout } from "@/shared";
import { User } from "../types/user";

const getUser = async (): Promise<User | null> => {
  try {
    const res = await fetch("api/user", { method: "POST" });
    const user = await res.json();
    if (user.error) {
      throw new Error(user.error);
    }
    return user;
  } catch (error) {
    return null;
  }
};
export default getUser;
