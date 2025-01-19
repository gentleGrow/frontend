"use client";

import React, { useEffect, useId, useState } from "react";
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
  onError?: (message: string) => void;
}

const NumberInput = ({
  value,
  onChange,
  placeholder,
  type,
  region,
  autoFill,
  variants = "default",
  onError,
}: NumberInputProps) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value); // 내부 상태 추가

  // 컴포넌트가 새로운 value prop을 받았을 때 localValue 업데이트
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (type === "ratio" && !autoFill) {
    assert("비율 타입은 autoFill 이 true 여야 합니다.");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.currentTarget.value;

    const targetValue = extractNumber(target);

    if (containsInvalidInput(target)) {
      onError?.("숫자만 입력해 주세요.");
    }

    setLocalValue(targetValue ?? ""); // onChange 대신 localValue 업데이트
  };

  const formatValue = () => {
    const valueToFormat = isFocused ? localValue : value; // 포커스 상태에 따라 다른 값 사용

    if (!valueToFormat && valueToFormat !== "0") return "";

    if (type === "price") {
      const prefix = region === "KRW" ? "₩ " : "$ ";
      return prefix + commaizeNumber(valueToFormat);
    }

    if (type === "amount") {
      return commaizeNumber(valueToFormat);
    }

    if (type === "ratio") {
      const numValue = Number(valueToFormat);
      const prefix = numValue > 0 ? "+" : "";
      return prefix + fixedNumberIfNeeds(numValue) + "%";
    }

    return valueToFormat; // 기본값 처리
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex h-full w-full flex-wrap items-center px-2.5",
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
          if (type === "price" && !localValue) {
            const prefix = region === "KRW" ? "₩ " : "$ ";
            e.currentTarget.value = prefix;
          }
        }}
        onClick={(e) => {
          if (type === "price" && !value) {
            const prefix = region === "KRW" ? "₩ " : "$ ";
            e.currentTarget.value = prefix;
          }
        }}
        onBlur={(e) => {
          setIsFocused(false);

          if (type === "price" && !localValue) {
            e.currentTarget.value = "";
          }
        }}
      />
    </label>
  );
};

export default NumberInput;
