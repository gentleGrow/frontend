import { PropsWithChildren, ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

interface Selection {
  name: string;
  icon?: ReactNode;
}

interface TagDropdownProps extends PropsWithChildren {
  onClick?: () => void;
  trailingIcon?: boolean;
  padding?: "small" | "medium";
  removeHoverEffect?: boolean;
  className?: string;
}

const Tag = ({
  onClick,
  children,
  trailingIcon,
  padding = "medium",
  removeHoverEffect = false,
  className,
}: TagDropdownProps) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex h-full w-full min-w-[100px] select-none flex-row items-center rounded-full border border-gray-20 bg-white py-[5.5px]",
        padding === "small" ? "px-[8px]" : "px-[10px]",
        !removeHoverEffect && "hover:bg-gray-5",
        className,
      )}
    >
      <button id={id} onClick={onClick} className="hidden"></button>
      <div className="line-clamp-1 flex-1 text-body-2">{children}</div>
      {trailingIcon && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.24091 3.7503L5 6.99121L1.75909 3.7503"
            stroke="#35393F"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </label>
  );
};

export default Tag;
