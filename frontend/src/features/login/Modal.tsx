import Close from "./Close";
import GoogleLoginButton from "./GoogleLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";
import NaverLoginButton from "./NaverLoginButton";

export default function Modal() {
  return (
    <div className="fixed left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white px-[36px] py-[64px] mobile:fixed mobile:left-1/2 mobile:top-1/2 mobile:h-[562px] mobile:max-w-[474px] mobile:-translate-x-1/2 mobile:-translate-y-1/2">
      <div className="flex h-full flex-col items-center justify-between except-mobile:mt-[120px] except-mobile:space-y-[135px]">
        <div className="space-y-[16px] text-center">
          <h2 className="text-heading-2">시작하기</h2>
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
