"use client";

import React, { PropsWithChildren } from "react";
import {
  Tooltip as TooltipOrigin,
  TooltipContent as TooltipContentOrigin,
  TooltipProvider,
  TooltipTrigger as TooltipTriggerOrigin,
} from "@/components/ui/tooltip";

const Tooltip = ({ children }: PropsWithChildren) => {
  const childArray = React.Children.toArray(children);

  if (childArray.length !== 2) {
    throw new Error("Tooltip component requires exactly 2 children");
  }

  return (
    <TooltipProvider>
      <TooltipOrigin>{children}</TooltipOrigin>
    </TooltipProvider>
  );
};

function TooltipTrigger({ children }: PropsWithChildren) {
  return <TooltipTriggerOrigin asChild>{children}</TooltipTriggerOrigin>;
}

function TooltipContent({ children }: PropsWithChildren) {
  return (
    <TooltipContentOrigin className="relative flex w-[230px] -translate-y-[6px] translate-x-1 flex-col items-center space-y-1 overflow-visible rounded-[8px] bg-gray-70 p-2.5 text-xs font-normal text-white">
      {children}
      <div className="triable-down absolute -bottom-[9px] left-1/2 z-9999 -translate-x-[6px]" />
    </TooltipContentOrigin>
  );
}

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

export default Tooltip;
