"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer
      className={cn(
        "mx-auto flex h-[84px] w-full items-center justify-between bg-gray-5 px-[20px]",
        pathname === "/asset-management/sheet" ? "" : "max-w-[1400px]",
      )}
    >
      <p>Copyrighted © insightout all rights reserved.</p>
      <p>email@gmail.com</p>
    </footer>
  );
};

export default Footer;
