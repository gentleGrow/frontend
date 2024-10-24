"use client";

import { useUser } from "@/entities";
import UserAgreement from "./UserAgreement";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import NicknameSetup from "./NicknameSetup";

export default function JoinDialog() {
  const { user, initializeUser } = useUser();
  const [state, setState] = useState<"agreement" | "nickname">("agreement");
  console.log("user", user);
  if (!user || (user && user.isJoined)) {
    return null;
  }
  return (
    <Dialog open={user && !user.isJoined}>
      {state === "agreement" ? (
        <UserAgreement nextStep={() => setState("nickname")} />
      ) : (
        <NicknameSetup initializeUser={initializeUser} />
      )}
    </Dialog>
  );
}
