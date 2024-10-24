"use client";

import { usePathname } from "next/navigation";
import LogoLink from "./LogoLink";
import Menus from "./Menu";
import Profile from "./Profile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      layout
      className={cn(
        "mx-auto flex h-[64px] w-full items-center justify-between px-[20px]",
        pathname === "/asset-management/sheet" ? "" : "max-w-[1400px]",
      )}
    >
      <div className="flex">
        <div className="mr-[120px] mobile:hidden">
          <LogoLink />
        </div>
        <Menus />
      </div>
      <div className="flex items-center">
        <div className="ml-[60px] flex space-x-[8px]">
          <Profile />
        </div>
      </div>
    </motion.header>
  );
}
