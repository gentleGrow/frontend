"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrimaryButton } from "@/shared";
import { useRouter, useSearchParams } from "next/navigation";

export default function FinishDeactivatedDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (searchParams.get("deactivated") === "false") return null;
  return (
    <Dialog open={searchParams.get("deactivated") === "true"}>
      <DialogContent className="gap-0 px-10 pb-10 pt-[64px]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-[36px]">회원 탈퇴 완료</DialogTitle>
          <DialogDescription className="text-base text-gray-80">
            회원 탈퇴가 정상적으로 완료되었습니다.
            <br />
            언제든 다시 돌아 주세요!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-[56px]">
          <PrimaryButton onClick={() => router.replace("/")}>
            확인
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
