import { getUser } from "@/entities";

export const checkIsJoined = async () => {
  const userData = await getUser();

  return userData.isJoined;
};
