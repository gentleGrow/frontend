import React, { memo, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

const TableHeader = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={cn(
        "relative h-[44px] border-collapse border-b-2 border-b-gray-50 px-2.5 py-[12.5px] text-body-2 font-semibold",
      )}
    >
      {children}
    </div>
  );
};

export default memo(TableHeader);
