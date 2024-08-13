"use client";
import Link from "next/link";
import Selected from "./Selected";
import { Heading } from "@/shared";

const MENUS = [
  { name: "홈", href: "/" },
  { name: "자산관리", href: "/asset-management" },
];
export default function Menus() {
  return (
    <nav className="flex space-x-[150px]">
      {MENUS.map((menu) => (
        <div key={menu.name} className="relative">
          <Selected menuHref={menu.href} />
          <Heading as="h4" fontSize="sm">
            <Link href={menu.href}>{menu.name}</Link>
          </Heading>
        </div>
      ))}
    </nav>
  );
}
