import { getUser } from "@/entities";
import HomeGuestAccessGuideButtonClient from "./HomeGuestAccessGuideButtonClient";

export default async function HomeGuestAccessGuideButton() {
  const user = await getUser();

  return <HomeGuestAccessGuideButtonClient user={user} />;
}
