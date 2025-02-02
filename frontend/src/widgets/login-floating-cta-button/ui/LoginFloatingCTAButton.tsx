import { getUser } from "@/entities";
import LoginFloatingCTAButtonClient from "./LoginFloatingCTAButtonClient";

export default async function LoginFloatingCTAButton() {
  const user = await getUser();

  return <LoginFloatingCTAButtonClient user={user} />;
}
