import clsx from "clsx";
import { ReactNode, ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = {
  isHover?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  buttonSize?: "large" | "medium";
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size">;

export default function PrimaryButton(props: PrimaryButtonProps) {
  const {
    isHover = false,
    isDisabled = false,
    onClick,
    buttonSize = "large",
    children,
    className,
    ...restProps
  } = props;

  const finalClassName = clsx(
    "relative rounded-md text-center  bg-green-60 font-semibold leading-[24px] text-white disabled:bg-gray-10 disabled:text-gray-50",
    buttonSize === "large" ? "h-12 w-full " : "h-9 w-fit px-[29.5px] text-sm",
    !isDisabled && "hover:bg-green-70",
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
