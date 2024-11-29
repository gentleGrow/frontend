import React from "react";
import clsx from "clsx";

export interface InputProps {
  id?: string;
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
  isError?: boolean;
}

export default function Input({
  id,
  type,
  classNames = "",
  placeholder = "",
  value,
  withImage = false,
  onChange,
  onFocus,
  onBlur,
  isHovered = false,
  isSelected = false,
  isDisabled = false,
  isError = false,
}: InputProps) {
  const baseClass = `font-regular h-[36px] w-full rounded-md border px-[10px] text-body-2 hover:border-gray-40 focus:outline-none focus:border-green-60`;
  const stateClasses = clsx({
    "pl-[44px]": withImage,
    "border-gray-20 bg-white text-gray-30": isDisabled,
    "border-gray-20 text-gray-100": !isDisabled && !isError,
    "border-green-60": isSelected && !isError,
    "border-gray-40": isHovered && !isError,
    "!border-alert": isError,
  });

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      disabled={isDisabled}
      className={clsx(baseClass, stateClasses, classNames)}
    />
  );
}
