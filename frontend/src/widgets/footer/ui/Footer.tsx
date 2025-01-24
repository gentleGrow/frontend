"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer
      className={cn(
        "mobile-459:pt-8 mx-auto w-full bg-gray-5 px-5 pb-[42px] pt-5",
        pathname === "/asset-management/sheet" ? "" : "max-w-[1400px]",
      )}
    >
      <div className="mobile-459:block flex flex-col gap-3 pb-[18px]">
        <div
          className={cn(
            "mobile-459:justify-center flex w-full items-center justify-start",
            "mobile-459:gap-9 gap-9",
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
          <span className="mobile-459:block hidden text-body-2 text-gray-90">
            ollass@gmail.com
          </span>
        </div>
        <div className="mobile-459:hidden block flex flex-row items-center justify-start">
          <span className="text-body-2 text-gray-90">ollass@gmail.com</span>
        </div>
      </div>
      <p className="text-center text-[14px] leading-[22px] text-gray-60">
        ollass에서 제공하는 투자 정보는 고객의 투자 판단을 위한 단순 참고용이며,
        투자자 자신의 판단과 책임 하에 종목 선택이나 투자시기에 대한 최종 결정을
        해야 합니다.
      </p>
    </footer>
  );
};

export default Footer;
