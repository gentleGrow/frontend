"use client";

import React, { useId, useState } from "react";
import { cn } from "@/lib/utils";
import {
  commaizeNumber,
  containsInvalidInput,
  extractNumber,
  fixedNumberIfNeeds,
} from "@/shared/utils/number";
import { assert } from "@/shared/utils/assert";

const ColorVariants = {
  default: "text-gray-90 bg-white",
  increase: "text-alert bg-increaseBackground",
  decrease: "text-decrease bg-decreaseBackground",
  "gray-light": "text-gray-50 bg-gray-5",
  "gray-dark": "text-gray-60 bg-gray-10",
};

interface NumberInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value?: string) => void;
  type?: "ratio" | "price" | "amount";
  region?: "USD" | "KRW";
  autoFill?: boolean;
  variants?: keyof typeof ColorVariants;
}

const NumberInput = ({
  value,
  onChange,
  placeholder,
  type,
  region,
  autoFill,
  variants = "default",
}: NumberInputProps) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (type === "ratio") {
    if (!autoFill) assert("비율 타입은 autoFill 이 true 여야 합니다.");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }
    let target = e.currentTarget.value;

    const targetValue = extractNumber(target);

    if (containsInvalidInput(target)) {
      setError(new Error("숫자만 입력해 주세요."));
    }
    onChange?.(targetValue ?? "");
  };

  const formatValue = () => {
    if (type === "price") {
      if (!value) return "";
      const price = value;
      const prefix = region === "KRW" ? "₩ " : "$ ";

      const commizedValue = commaizeNumber(price);
      return prefix + commizedValue;
    }

    if (type === "amount") {
      if (!value) return "";
      return commaizeNumber(value);
    }

    if (type === "ratio") {
      if (value === undefined) return;
      const prefix = Number(value) > 0 ? "+" : "";
      return prefix + fixedNumberIfNeeds(Number(value)) + "%";
    }
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex h-full w-full flex-wrap items-center px-2.5",
        isFocused && !error && "rounded-[4px] border border-green-60",
        error && "rounded-[4px] border border-alert",
        ColorVariants[variants],
      )}
    >
      <input
        disabled={autoFill}
        readOnly={autoFill}
        id={id}
        className={cn(
          "h-full w-full bg-transparent text-right text-body-2 text-inherit focus:outline-none",
          variants === "gray-dark"
            ? "placeholder:text-gray-60"
            : "placeholder:text-gray-50",
        )}
        placeholder={placeholder}
        value={formatValue()}
        onChange={handleChange}
        onFocus={(e) => {
          setIsFocused(true);
        }}
        onClick={(e) => {
          if (type === "price" && !value) {
            const prefix = region === "KRW" ? "₩ " : "$ ";
            e.currentTarget.value = prefix;
          }
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
            e.currentTarget.value.length;
        }}
        onBlur={(e) => {
          setIsFocused(false);
          setError(null);
          if (type === "price" && !value) {
            e.currentTarget.value = "";
          }
        }}
      />
      {error && (
        <p className="absolute -top-[25px] left-0 z-50 flex min-w-[123px] flex-row items-center gap-0.5 rounded-[4px] bg-alert p-1 text-[10px] font-medium text-alert">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="5.5" fill="white" stroke="#F84A4A" />
            <rect
              x="7.375"
              y="4.38672"
              width="1.25"
              height="5"
              fill="#F84A4A"
            />
            <rect
              x="7.375"
              y="10.3633"
              width="1.25"
              height="1.25"
              fill="#F84A4A"
            />
          </svg>
          <span className="text-white">{error.message}</span>
        </p>
      )}
    </label>
  );
};

export default NumberInput;
