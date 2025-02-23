"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer
      className={cn(
        "mx-auto w-full bg-gray-5 px-5 pb-[42px] pt-5 mobile-459:pt-8",
        pathname.includes("asset-management") ? "" : "max-w-[1400px]",
      )}
    >
      <div className="flex flex-col gap-3 pb-[18px] mobile-459:block">
        <div
          className={cn(
            "flex w-full items-center justify-start mobile-459:justify-center",
            "gap-9 mobile-459:gap-9",
          )}
        >
          <Link href="" className="text-body-3 text-gray-90 hover:text-primary">
            서비스 이용약관
          </Link>
          <div className="h-3 w-px rounded-full bg-gray-30" />
          <Link href="" className="text-body-3 text-gray-90 hover:text-primary">
            개인정보처리방침
          </Link>
          <div className="h-3 w-px rounded-full bg-gray-30" />
          <span className="hidden text-body-2 text-gray-90 mobile-459:block">
            ollass@gmail.com
          </span>
        </div>
        <div className="flex flex-row items-center justify-start mobile-459:hidden">
          <span className="text-body-2 text-gray-90">ollass@gmail.com</span>
        </div>
      </div>
      <p className="text-center text-[14px] leading-[22px] text-gray-60">
        ollass에서 제공하는 투자 정보는 고객의 투자 판단을 위한 단순 참고용이며,
        투자자 자신의 판단과 책임 하에 종목 선택이나 투자시기에 대한 최종 결정을
        해야 합니다.
        <br />본 서비스에서 제공하는 수익률, 배당금, 투자 예상 금액 등은 예상
        추정치이며, 실제 가격 및 수익률과 다를 수 있습니다.
      </p>
    </footer>
  );
};

export default Footer;
