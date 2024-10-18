import React from "react";
import clsx from "clsx";

export interface InputProps {
  type: string;
  classNames?: string;
  placeholder?: string;
  value?: string;
  withImage?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isHovered?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isDone?: boolean;
  isError?: boolean;
}

export default function Input({
  type,
  classNames,
  placeholder,
  value,
  withImage,
  onChange,
  onFocus,
  onBlur,
  isHovered = false,
  isSelected = false,
  isDisabled = false,
  isError = false,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      disabled={isDisabled}
      className={clsx(
        `font-regular h-[36px] w-full rounded-md border border-gray-20 px-[10px] text-body-2 text-gray-100 hover:border-gray-40 focus:border-green-60 focus:outline-none disabled:border-gray-20 disabled:bg-white disabled:text-gray-30`,
        classNames,
        {
          "pl-[44px]": withImage,
          "border-gray-20 bg-white text-gray-30": isDisabled,
          "border-green-60": isSelected && !isError,
          "border-gray-40": isHovered && !isError,
          "!border-alert": isError,
        },
      )}
    />
  );
}
