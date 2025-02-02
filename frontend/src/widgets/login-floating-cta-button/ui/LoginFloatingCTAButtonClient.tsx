"use client";
import { User } from "@/entities";
import { loginModalAtom } from "@/features";
import { FloatingButton } from "@/shared";
import { useSetAtom } from "jotai";

export default function LoginFloatingCTAButtonClient({
  user,
}: {
  user: User | null;
}) {
  const setIsOpenLoginModal = useSetAtom(loginModalAtom);

  if (user?.isJoined) return null;

  return (
    <div
      className={`fixed bottom-[64px] left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center`}
    >
      <FloatingButton
        onClick={() => {
          setIsOpenLoginModal(true);
        }}
      >
        로그인하고 나만의 분석 화면을 만들어 보세요.
      </FloatingButton>
    </div>
  );
}
