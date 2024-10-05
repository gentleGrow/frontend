"use client";
import { useUser } from "@/entities";
import { loginModalAtom } from "@/features";
import { FloatingButton } from "@/shared";
import { useSetAtom } from "jotai";

export default function HomeGuestAccessGuideButton() {
  const { user } = useUser();

  const setIsOpenLoginModal = useSetAtom(loginModalAtom);
  return (
    <div
      className={`absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 justify-center ${user?.isLoggedIn ? "hidden" : "block"}`}
    >
      <FloatingButton
        onClick={() => {
          setIsOpenLoginModal(true);
        }}
      >
        가데이터로 구성한 화면입니다. 자산 시트를 작성하고 나만의 데이터를
        확인하세요.
      </FloatingButton>
    </div>
  );
}
