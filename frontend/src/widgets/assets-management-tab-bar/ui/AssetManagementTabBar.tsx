"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/widgets/assets-management-tab-bar/constants/navItems";
import { useAtomValue } from "jotai";
import { lastUpdatedAtAtom } from "@/entities/asset-management/atoms/lastUpdatedAtAtom";
import { ReactNode, useEffect, useState } from "react";
import { cellErrorAtom } from "@/widgets/asset-management-draggable-table/atoms/cellErrorAtom";

const AssetManagementTabBar: React.FC = () => {
  const [toggle, setToggle] = useState(false);

  const errorInfo = useAtomValue(cellErrorAtom);

  const pathname = usePathname(); // 현재 경로 가져오기

  const lastUpdatedAt = useAtomValue(lastUpdatedAtAtom);

  let diffInMinutes: number | null = null;

  if (lastUpdatedAt) {
    diffInMinutes = Math.floor(
      (new Date().getTime() - lastUpdatedAt.getTime()) / 1000 / 60,
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setToggle((prev) => !prev);
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  let content: ReactNode | null = null;

  if (pathname === "/asset-management/sheet") {
    if (diffInMinutes !== null) {
      content = (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-body-5 text-gray-60 mobile:hidden">
          {diffInMinutes}분 전에 자동 저장되었습니다.
        </div>
      );
    }

    if (errorInfo) {
      content = (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-body-5 text-alert mobile:hidden">
          자동 저장에 실패했습니다. 셀을 확인해 주세요.
        </div>
      );
    }
  }

  return (
    <ul className="relative mx-5 my-5 flex flex-row border-b-[1px] border-[#CDD4DC] except-mobile:-mx-5 except-mobile:gap-3 except-mobile:px-5">
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`relative px-1.5 py-3 text-lg mobile:w-full mobile:text-center ${
            pathname === href
              ? "font-bold text-gray-100"
              : "font-normal text-gray-60"
          }`}
        >
          <li>{label}</li>
          {pathname === href && (
            <hr className="absolute -bottom-[1px] left-0 h-1.5 w-full bg-gray-100" />
          )}
        </Link>
      ))}
      {content}
    </ul>
  );
};

export default AssetManagementTabBar;
