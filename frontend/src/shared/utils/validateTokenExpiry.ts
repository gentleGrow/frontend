import { decode } from "jsonwebtoken";

const validateTokenExpiry = async (accessToken: string) => {
  try {
    const decoded = decode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    if (
      typeof decoded !== "string" &&
      decoded?.exp &&
      (decoded.exp as number) < currentTime
    ) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default validateTokenExpiry;
