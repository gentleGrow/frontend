"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsProps {
  items: { href: string; label: string }[]; // 탭 항목 배열
}

const Tabs: React.FC<TabsProps> = ({ items }) => {
  const pathname = usePathname(); // 현재 경로 가져오기

  return (
    <ul className="mb-4 flex space-x-2.5 border-b-[1px] border-[#CDD4DC]">
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-[12px] py-[6px] text-lg ${
            pathname === href
              ? "border-b-[3px] border-black font-bold text-gray-100"
              : "font-normal text-gray-60"
          }`}
        >
          <li>{label}</li>
        </Link>
      ))}
    </ul>
  );
};

export default Tabs;
