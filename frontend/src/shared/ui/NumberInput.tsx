"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { commaizeNumber, fixedNumberIfNeeds } from "@/shared/utils/number";
import { assert } from "@/shared/utils/assert";
import { isNumber } from "es-toolkit/compat";
import { decommaizeNumber } from "@toss/utils";

const ColorVariants = {
  default: "text-gray-90 bg-white",
  increase: "text-alert bg-increaseBackground",
  decrease: "text-decrease bg-decreaseBackground",
  "gray-light": "text-gray-50 bg-gray-5",
  "gray-dark": "text-gray-60 bg-gray-10",
};

interface NumberInputProps {
  placeholder?: string;
  value?: number;
  onChange?: (value: number) => void;
  type?: "ratio" | "price" | "amount";
  region?: "USD" | "KRW";
  autoFill?: boolean;
  variants?: keyof typeof ColorVariants;
  onError?: (message: string) => void;
}

const NumberInput = ({
  value,
  onChange,
  placeholder,
  type,
  region = "KRW",
  autoFill,
  variants = "default",
  onError,
}: NumberInputProps) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const getCurrencyPrefix = () => (region === "KRW" ? "₩ " : "$ ");

  const formatValue = () => {
    if (!isFocused) {
      // 포커스가 없을 때는 일반적인 표시 형식
      if (!value && value !== 0) return "";

      if (type === "price") {
        return getCurrencyPrefix() + commaizeNumber(value);
      }

      if (type === "amount") {
        return commaizeNumber(value);
      }

      if (type === "ratio") {
        const numValue = Number(value);
        const prefix = numValue > 0 ? "+" : "";
        return prefix + fixedNumberIfNeeds(numValue) + "%";
      }

      return value;
    } else {
      // 포커스 상태일 때
      if (type === "price") {
        if (!localValue && localValue !== 0) {
          return getCurrencyPrefix();
        }
        return getCurrencyPrefix() + commaizeNumber(localValue);
      }

      if (!localValue && localValue !== 0) return "";

      if (type === "amount") {
        return commaizeNumber(localValue);
      }

      if (type === "ratio") {
        return String(localValue);
      }

      return localValue;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);

    // 커서를 값의 끝으로 이동
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isNumber(localValue)) {
      onChange?.(localValue);
    }
  };

  const parseNumber = (value: string) => {
    let parsedValue: string | null = value;

    if (type === "price") {
      parsedValue = value.replace(getCurrencyPrefix(), "");
    } else if (type === "ratio") {
      parsedValue = value.replace("%", "");
    }

    return decommaizeNumber(parsedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.currentTarget.value;
    const parsedValue = parseNumber(targetValue);

    if (!isNumber(parsedValue)) {
      onError?.("숫자만 입력해 주세요.");
      return;
    }

    setLocalValue(parsedValue);
  };

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (type === "ratio" && !autoFill) {
    assert("비율 타입은 autoFill이 true여야 합니다.");
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex h-full w-full flex-wrap items-center px-2.5",
        ColorVariants[variants],
      )}
    >
      <input
        ref={inputRef}
        disabled={autoFill}
        readOnly={autoFill}
        id={id}
        className={cn(
          "h-full w-full bg-transparent text-right text-body-2 text-inherit focus:outline-none focus:placeholder:text-transparent",
          variants === "gray-dark"
            ? "placeholder:text-gray-60"
            : "placeholder:text-gray-50",
        )}
        placeholder={placeholder}
        value={formatValue()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </label>
  );
};

export default NumberInput;
