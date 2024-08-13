"use client";
import Link from "next/link";
import Selected from "./Selected";
import { useState } from "react";

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
          <Link href={menu.href} className="">
            {menu.name}
          </Link>
        </div>
      ))}
    </nav>
  );
}
