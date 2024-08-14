"use client";
import { usePathname } from "next/navigation";
import MenuItem from "./MenuItem";
const MENUS = [
  { name: "홈", href: "/" },
  { name: "자산관리", href: "/asset-management" },
];
export default function Menus() {
  const pathname = usePathname();
  return (
    <nav className="flex space-x-[150px]">
      {MENUS.map((menu) => (
        <div key={menu.name}>
          <MenuItem
            name={menu.name}
            href={menu.href}
            isSelected={
              menu.href === "/"
                ? pathname === "/"
                : pathname.includes(menu.href)
            }
          />
        </div>
      ))}
    </nav>
  );
}
