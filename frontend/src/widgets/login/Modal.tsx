import { Heading } from "@/shared";
import Close from "./Close";
import GoogleLoginButton from "./GoogleLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";
import NaverLoginButton from "./NaverLoginButton";

export default function Modal() {
  return (
    <div className="bg-white min-545:fixed min-545:left-1/2 min-545:top-1/2 min-545:h-[562px] min-545:max-w-[474px] min-545:-translate-x-1/2 min-545:-translate-y-1/2 relative flex w-full items-center justify-center rounded-2xl px-[36px] py-[64px]">
      <div className="max-546:mt-[120px] max-546:space-y-[135px] flex h-full flex-col items-center justify-between">
        <div className="space-y-[16px] text-center">
          <Heading fontSize="2xl">시작하기</Heading>
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
      <div className="absolute right-[20px] top-[20px]">
        <Close />
      </div>
    </div>
  );
}
