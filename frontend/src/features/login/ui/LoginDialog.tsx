"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import KakaoLoginButton from "../KakaoLoginButton";
import NaverLoginButton from "../NaverLoginButton";
import GoogleLoginButton from "../GoogleLoginButton";
import useLogin from "../hooks/useLogin";

export default function LoginDialog() {
  const { isMobile } = useLogin();
  return (
    <Dialog modal={!isMobile}>
      <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-5 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        로그인
      </DialogTrigger>
      <DialogContent className="p-0 px-[40px] mobile-545:h-full mobile-545:min-w-full">
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
