import { getUser } from "@/entities";

export const checkIsJoined = async () => {
  const userData = await getUser();

  if (!userData) {
    return false;
  }

  return userData.isJoined;
};
