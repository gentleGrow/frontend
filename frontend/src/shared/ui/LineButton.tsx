import clsx from "clsx";
import { ReactNode } from "react";

export default function LineButton({
  title,
  align = "center",
  isHover = false,
  isDisabled = false,
  onClick,
  props,
  children,
}: {
  title: string;
  align?: "center" | "left";
  isHover?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  props?: Record<string, any>;
  children?: ReactNode;
}) {
  const { className, ...restProps } = props || {};

  const finalClassName = clsx(
    "relative h-[48px] w-full rounded-md border text-[16px] font-semibold leading-[24px] text-[#2A2D31] disabled:text-[#B9BCC1] ",
    {
      "text-center": align === "center",
      "text-left pl-[40px]": align === "left",
      "hover:border-[#999DA4]": !isDisabled,
      "border-[#D8DADC]": !isHover && !isDisabled,
      "border-[#999DA4]": isHover,
      "border-[#D8DADC] text-[#B9BCC1]": isDisabled,
    },
    className,
  );

  return (
    <button
      className={finalClassName}
      disabled={isDisabled}
      onClick={onClick}
      {...restProps}
    >
      <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
        {children}
      </div>
      {title}
    </button>
  );
}
