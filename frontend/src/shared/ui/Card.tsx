"use client";

import { ReactNode } from "react";
import { TooltipWithIcon } from "@/shared";

interface CardProps {
  children: ReactNode; // children prop의 타입 정의
  title?: string;
  width?: string; // 너비를 위한 prop 추가
  height?: string; // 높이를 위한 prop 추가
  withTooltip?: boolean;
  tooltipText?: string;
}

export default function Card({
  children,
  title,
  width,
  height,
  withTooltip = false,
  tooltipText = "",
}: CardProps) {
  return (
    <div
      className="flex flex-col justify-between rounded-lg border bg-white p-4"
      style={{ width: width, height: height }}
    >
      {title && (
        <h2 className="flex flex-row items-center gap-1">
          <span className="text-heading-2 font-bold text-gray-80">{title}</span>
          {withTooltip && <TooltipWithIcon text={tooltipText} />}
        </h2>
      )}
      {children}
    </div>
  );
}
