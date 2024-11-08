import React, { memo, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface TableCellProps extends PropsWithChildren {
  error?: boolean;
  errorMessage?: string;
}

const TableCell = ({
  children,
  error = false,
  errorMessage = "에러가 발생했습니다.",
}: TableCellProps) => {
  return (
    <div
      className={cn(
        "relative z-20 h-[44px] border-collapse overflow-visible text-body-2",
        error
          ? "border border-alert"
          : "border-b border-r border-gray-10 border-r-gray-10",
      )}
    >
      {children}
      {error && (
        <p className="absolute -left-[2px] -top-[2px] z-50 flex max-w-full -translate-y-full flex-row items-center gap-0.5 text-wrap rounded-[4px] bg-alert py-1 pl-1 pr-2 text-[10px] font-medium text-alert">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="5.5" fill="white" stroke="#F84A4A" />
            <rect
              x="7.375"
              y="4.38672"
              width="1.25"
              height="5"
              fill="#F84A4A"
            />
            <rect
              x="7.375"
              y="10.3633"
              width="1.25"
              height="1.25"
              fill="#F84A4A"
            />
          </svg>
          <span className="text-white">{errorMessage}</span>
        </p>
      )}
    </div>
  );
};

export default memo(TableCell);
