"use client";

import AssetManagementTabBar from "@/widgets/assets-management-tab-bar/ui/AssetManagementTabBar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AssetManagement: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  return (
    <motion.div
      layout
      className={cn(
        "mx-auto flex w-full flex-1 flex-col gap-4 bg-gray-5 except-mobile:px-5",
        pathname === "/asset-management/sheet" ? "" : "max-w-[1400px]",
      )}
    >
      <AssetManagementTabBar />
      <div>{children}</div>
    </motion.div>
  );
};

export default AssetManagement;
