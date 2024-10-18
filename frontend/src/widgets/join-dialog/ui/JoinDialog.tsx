"use client";

import { useUser } from "@/entities";
import UserAgreement from "./UserAgreement";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import NicknameSetup from "./NicknameSetup";

export default function JoinDialog() {
  const { user } = useUser();
  const [state, setState] = useState<"agreement" | "nickname">("nickname");

  if (user && user.isActivated) {
    return null;
  }
  return (
    <Dialog
      //open={user && !user?.isActivated}
      open={true}
    >
      {state === "agreement" ? <UserAgreement /> : <NicknameSetup />}
    </Dialog>
  );
}
