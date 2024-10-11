"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import KakaoLoginButton from "../KakaoLoginButton";
import NaverLoginButton from "../NaverLoginButton";
import GoogleLoginButton from "../GoogleLoginButton";
import useMediaQuery from "../../../shared/hooks/useMediaQuery";
import { loginModalAtom } from "../atoms/loginAtoms";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export default function LoginDialog({}: {}) {
  const { isMobile } = useMediaQuery();
  const isOpenLoginModal = useAtomValue(loginModalAtom);
  const setIsOpenLoginModal = useSetAtom(loginModalAtom);

  useEffect(() => {
    if (isMobile && isOpenLoginModal) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, isOpenLoginModal]);

  return (
    <Dialog modal={!isMobile} open={isOpenLoginModal}>
      <DialogContent
        className="p-0 px-[40px] mobile-545:h-full mobile-545:min-w-full"
        onPointerDownOutside={() => {
          setIsOpenLoginModal(false);
        }}
      >
        <DialogTitle className="hidden">로그인</DialogTitle>
        <DialogDescription className="hidden" />
        <DialogClose
          onClick={() => {
            setIsOpenLoginModal(false);
          }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-40 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.1943 10.4171C23.6393 9.97216 23.6393 9.2507 23.1943 8.80571C22.7493 8.36073 22.0278 8.36073 21.5829 8.80571L16 14.3886L10.4171 8.80572C9.97216 8.36073 9.2507 8.36073 8.80571 8.80571C8.36073 9.2507 8.36073 9.97216 8.80571 10.4171L14.3886 16L8.80571 21.5829C8.36073 22.0278 8.36073 22.7493 8.80571 23.1943C9.2507 23.6393 9.97216 23.6393 10.4171 23.1943L16 17.6114L21.5829 23.1943C22.0278 23.6393 22.7493 23.6393 23.1943 23.1943C23.6393 22.7493 23.6393 22.0278 23.1943 21.5829L17.6114 16L23.1943 10.4171Z"
              fill="#4F555E"
            />
          </svg>
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="flex h-full flex-col items-center justify-between mobile-545:pb-[72px] mobile-545:pt-[150px] except-mobile-545:space-y-[135px] except-mobile-545:py-[64px]">
          <div className="space-y-[16px] text-center">
            <h1 className="text-heading-1">시작하기</h1>
            <p className="inline-block max-w-[394px] text-[16px] font-medium leading-[24px]">
              투자 현황을 기록하고 분석해 더 나은 투자를 만들어 갑니다. 간편
              로그인으로 쉽고 빠르게 서비스를 시작하세요.
            </p>
          </div>
          <div className="flex flex-col space-y-[24px]">
            <KakaoLoginButton />
            <NaverLoginButton />
            <GoogleLoginButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
