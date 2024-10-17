"use client";

import { useUser } from "@/entities";
import UserAgreement from "./UserAgreement";
import { Dialog } from "@/components/ui/dialog";

export default function JoinDialog() {
  const { user } = useUser();

  if (user && user.isActivated) {
    return null;
  }
  return (
    <Dialog
      //open={user && !user?.isActivated}
      open={true}
    >
      <UserAgreement />
    </Dialog>
  );
}
