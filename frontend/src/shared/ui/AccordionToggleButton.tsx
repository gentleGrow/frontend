"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";

interface AccordionButtonProps {
  onToggle: (value: boolean) => void;
  value: boolean;
}

const AccordionToggleButton: FC<AccordionButtonProps> = ({
  onToggle,
  value,
}) => {
  const handleClick = () => {
    onToggle(!value);
  };

  return (
    <button
      className={cn(
        "flex h-full items-center justify-center p-2.5",
        value ? "rotate-180" : "",
      )}
      type="button"
      onClick={handleClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.75732 12L9.99996 7.75736L14.2426 12"
          stroke="#5D646E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default AccordionToggleButton;
