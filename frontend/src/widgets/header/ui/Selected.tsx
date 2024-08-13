"use client";
import { green } from "@/shared/ui/themes/variables/colors/static/light";
import { usePathname } from "next/navigation";

export default function Selected({ menuHref }: { menuHref: string }) {
  const pathname = usePathname();
  const isSelected =
    menuHref === "/" ? pathname === "/" : pathname.includes(menuHref);

  if (!isSelected) return null;

  return (
    <div
      className="absolute -top-[3px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full"
      style={{ backgroundColor: green[50] }}
    />
  );
}
