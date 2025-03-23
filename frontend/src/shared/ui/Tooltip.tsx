"use client";

import React, { PropsWithChildren } from "react";
import {
  Tooltip as TooltipOrigin,
  TooltipContent as TooltipContentOrigin,
  TooltipTrigger as TooltipTriggerOrigin,
} from "@/components/ui/tooltip";
import { createPortal } from "react-dom";

interface TooltipProps extends PropsWithChildren {
  open?: boolean;
}

const Tooltip = ({ children, open }: TooltipProps) => {
  return <TooltipOrigin open={open}>{children}</TooltipOrigin>;
};

function TooltipTrigger({ children }: PropsWithChildren) {
  return <TooltipTriggerOrigin asChild>{children}</TooltipTriggerOrigin>;
}

function TooltipContent({ children }: PropsWithChildren) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <TooltipContentOrigin
      className="flex max-w-[230px] -translate-y-[6px] translate-x-1 flex-col items-center space-y-1 overflow-visible rounded-[8px] bg-gray-70 p-2.5 text-xs font-normal text-white"
      sideOffset={5}
      side="top"
      style={{ zIndex: 99999 }}
    >
      {children}
      <div className="triable-down absolute -bottom-[9px] left-1/2 z-[99999] -translate-x-[6px]" />
    </TooltipContentOrigin>,
    document.body
  );
}

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

export default Tooltip;
