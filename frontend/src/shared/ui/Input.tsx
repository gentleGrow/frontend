import React from "react";
import clsx from "clsx";

interface InputProps {
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isHovered?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isDone?: boolean;
}

export default function Input({
  type,
  placeholder,
  value,
  onChange,
  isHovered = false,
  isSelected = false,
  isDisabled = false,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
      className={clsx(
        "focus:border-green-60 text-body-sm font-regular rounded-md border border-gray-20 px-[10px] py-[9.5px] text-gray-100 hover:border-gray-40 focus:outline-none disabled:border-gray-20 disabled:bg-white disabled:text-gray-30",
        {
          "border-gray-20 bg-white text-gray-30": isDisabled,
          "border-green-60": isSelected,
          "border-gray-40": isHovered,
        },
      )}
    />
  );
}
