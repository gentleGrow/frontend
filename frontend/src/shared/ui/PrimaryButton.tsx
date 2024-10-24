import clsx from "clsx";
import { ReactNode } from "react";

export default function PrimaryButton({
  isHover = false,
  isDisabled = false,
  onClick,
  props,
  children,
}: {
  isHover?: boolean;
  isDisabled?: boolean;
  props?: Record<string, any>;
  onClick?: () => void;
  children?: ReactNode;
}) {
  const { className, ...restProps } = props || {};

  const finalClassName = clsx(
    "relative h-[48px] w-full rounded-md  text-center text-[16px] bg-green-60 font-semibold leading-[24px] text-white disabled:bg-gray-10 disabled:text-gray-50",
    {
      " hover:bg-green-70": !isDisabled,
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
      {children}
    </button>
  );
}
