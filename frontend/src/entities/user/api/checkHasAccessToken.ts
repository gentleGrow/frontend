import { FRONT_SERVER_URL } from "@/shared";

const checkHasAccessToken = async () => {
  const hasAccessToken = await fetch(
    `${FRONT_SERVER_URL}/api/user/has-access-token`,
    { method: "POST" },
  )
    .then((res) => res.json())
    .then((data) => data.hasAccessToken);
  return hasAccessToken;
};
export default checkHasAccessToken;
