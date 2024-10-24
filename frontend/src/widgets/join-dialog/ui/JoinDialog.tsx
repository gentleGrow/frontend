"use client";

import { useUser } from "@/entities";
import UserAgreement from "./UserAgreement";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import NicknameSetup from "./NicknameSetup";
import { deleteCookie } from "@/shared";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/constants/cookie";

export default function JoinDialog() {
  const { user, initializeUser } = useUser();
  const [state, setState] = useState<"agreement" | "nickname">("agreement");
  if (!user || (user && user.isJoined)) {
    return null;
  }
  const handleClose = () => {
    deleteCookie(ACCESS_TOKEN);
    deleteCookie(REFRESH_TOKEN);
    initializeUser();
  };
  return (
    <Dialog open={user && !user.isJoined}>
      {state === "agreement" ? (
        <UserAgreement
          handleClose={handleClose}
          nextStep={() => setState("nickname")}
        />
      ) : (
        <NicknameSetup
          initializeUser={initializeUser}
          handleClose={handleClose}
        />
      )}
    </Dialog>
  );
}
