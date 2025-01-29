"use client";

import React, { memo, PropsWithChildren, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TableCellProps extends PropsWithChildren {
  error?: boolean;
  errorMessage?: string;
  tableId: string;
}

const errorId = "cell-error-message";
const errorBorderDisplayerId = "cell-error-border-displayer";

const generateErrorHTML = (errorMessage: string) => `
          <svg
            class="shrink-0"
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
          <span class="text-white shrink-0 break-words text-nowrap line-clamp-2">${errorMessage}</span>
`;

const TableCell = ({
  children,
  error = false,
  errorMessage = "에러가 발생했습니다.",
  tableId,
}: TableCellProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error || !ref?.current) {
      return;
    }

    const table = document.getElementById(tableId);

    if (!table) {
      return;
    }

    const errorElement = document.createElement("div");
    errorElement.innerHTML = generateErrorHTML(errorMessage);

    const errorBorderDisplayer = document.createElement("div");

    const cellRect = ref.current.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    const scrollLeft = table.scrollLeft;

    const relativeTop = cellRect.top - tableRect.top;
    const relativeLeft = cellRect.left - tableRect.left + scrollLeft;

    errorBorderDisplayer.id = errorBorderDisplayerId;
    errorBorderDisplayer.className = "border border-alert";
    errorBorderDisplayer.style.borderRadius = "4px";
    errorBorderDisplayer.style.position = "absolute";
    errorBorderDisplayer.style.top = `${relativeTop}px`; // Subtracts table's top position
    errorBorderDisplayer.style.left = `${relativeLeft + 0.5}px`; // Subtracts table's left position
    errorBorderDisplayer.style.width = `${cellRect.width}px`;
    errorBorderDisplayer.style.height = `${cellRect.height}px`;
    errorBorderDisplayer.style.zIndex = "10000";

    errorElement.id = errorId;
    errorElement.className =
      "flex -translate-y-full flex-row items-center gap-0.5 rounded-[4px] bg-alert py-1 pl-1 pr-2 text-[10px] font-medium text-white";
    errorElement.style.position = "absolute";
    errorElement.style.top = `${relativeTop}px`; // Subtracts table's top position
    errorElement.style.left = `${relativeLeft + 0.5}px`; // Subtracts table's left position
    errorElement.style.maxWidth = `${cellRect.width}px`;
    errorElement.style.zIndex = "10000";
    errorElement.style.transform = "translateY(-100%)";

    table.appendChild(errorElement);
    table.appendChild(errorBorderDisplayer);

    return () => {
      document.getElementById(errorId)?.remove();
      document.getElementById(errorBorderDisplayerId)?.remove();
    };
  }, [error, errorMessage, tableId]);

  return (
    <div
      ref={ref}
      className={cn("h-[44px] border-collapse overflow-hidden text-body-2")}
    >
      {children}
    </div>
  );
};

export default memo(TableCell);
