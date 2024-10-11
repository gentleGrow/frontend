import { PropsWithChildren } from "react";

const Tooltip = ({ children }: PropsWithChildren) => {
  return <div className="relative">{children}</div>;
};

function TooltipTrigger({ children }: PropsWithChildren) {
  return (
    <div title="툴팁" className="peer cursor-pointer">
      {children}
    </div>
  );
}

function TooltipContent({ children }: PropsWithChildren) {
  return (
    <ul className="absolute -top-[13px] left-2 w-[230px] -translate-x-1/2 -translate-y-full space-y-1 rounded-[8px] bg-gray-70 p-2.5 text-xs font-normal text-white opacity-0 peer-hover:opacity-100">
      {children}
      <div className="triable-down absolute -bottom-[11px] left-1/2 -translate-x-[6px]" />
    </ul>
  );
}

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

export default Tooltip;
