"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsProps {
  items: { href: string; label: string }[]; // 탭 항목 배열
}

const Tabs: React.FC<TabsProps> = ({ items }) => {
  const pathname = usePathname(); // 현재 경로 가져오기

  return (
    <ul className="my-5 flex flex-row border-b-[1px] border-[#CDD4DC] except-mobile:-mx-5 except-mobile:gap-3 except-mobile:px-5">
      {items.map(({ href, label }) => (
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
    </ul>
  );
};

export default Tabs;
