import React, { memo, PropsWithChildren, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TableCellProps extends PropsWithChildren {
  error?: boolean;
  errorMessage?: string;
}

const errorId = "cell-error-message";
const errorBorderDisplayerId = "cell-error-border-displayer";

const generateErrorHTML = (errorMessage: string) => `
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
          <span className="text-white">${errorMessage}</span>
`;

const TableCell = ({
  children,
  error = false,
  errorMessage = "에러가 발생했습니다.",
}: TableCellProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error || !ref) {
      return;
    }

    const table = document.getElementById("table");

    if (!table) {
      return;
    }

    const tableRect = table.getBoundingClientRect(); // Obtains position of the table

    const errorElement = document.createElement("div");
    errorElement.innerHTML = generateErrorHTML(errorMessage);

    const errorBorderDisplayer = document.createElement("div");

    const rect = ref.current?.getBoundingClientRect();

    if (!rect) return;

    errorBorderDisplayer.id = errorBorderDisplayerId;
    errorBorderDisplayer.className = "border border-alert";
    errorBorderDisplayer.style.borderRadius = "4px";
    errorBorderDisplayer.style.position = "absolute";
    errorBorderDisplayer.style.top = `${rect.top - tableRect.top}px`; // Subtracts table's top position
    errorBorderDisplayer.style.left = `${rect.left - tableRect.left + 1}px`; // Subtracts table's left position
    errorBorderDisplayer.style.width = `${rect.width}px`;
    errorBorderDisplayer.style.height = `${rect.height}px`;
    errorBorderDisplayer.style.zIndex = "999";

    errorElement.id = errorId;
    errorElement.className =
      "flex w-fit -translate-y-full flex-row items-center gap-0.5 text-wrap rounded-[4px] bg-alert py-1 pl-1 pr-2 text-[10px] font-medium text-white";
    errorElement.style.position = "absolute";
    errorElement.style.top = `${rect.top - tableRect.top}px`; // Subtracts table's top position
    errorElement.style.left = `${rect.left - tableRect.left}px`; // Subtracts table's left position
    errorElement.style.maxWidth = `${rect.width}px`;
    errorElement.style.zIndex = "1000";
    errorElement.style.transform = "translateY(-100%)";

    table.appendChild(errorElement);
    table.appendChild(errorBorderDisplayer);

    return () => {
      document.getElementById(errorId)?.remove();
      document.getElementById(errorBorderDisplayerId)?.remove();
    };
  }, [error, errorMessage]);

  return (
    <>
      <div
        ref={ref}
        className={cn("h-[44px] border-collapse overflow-hidden text-body-2")}
      >
        {children}
      </div>
    </>
  );
};

export default memo(TableCell);
