"use client";

import React, { useEffect, useId, useState } from "react";
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
  region,
  autoFill,
  variants = "default",
  onError,
}: NumberInputProps) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value); // 내부 상태 추가

  const removePricePrefix = (priceStr: string) =>
    priceStr.slice(2, priceStr.length);

  const removeRatioSuffix = (ratioStr: string) =>
    ratioStr.slice(0, ratioStr.length - 1);

  const parseNumber = (value: string) => {
    switch (type) {
      case "ratio":
        return decommaizeNumber(removeRatioSuffix(value));
      case "price":
        return decommaizeNumber(removePricePrefix(value));
      case "amount":
        return decommaizeNumber(value);
      default:
        return null;
    }
  };

  // 컴포넌트가 새로운 value prop을 받았을 때 localValue 업데이트
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (type === "ratio" && !autoFill) {
    assert("비율 타입은 autoFill 이 true 여야 합니다.");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let targetValue = e.currentTarget.value;

    const parsedValue = parseNumber(targetValue);

    if (parsedValue === null) {
      throw new Error(
        "유효하지 않은 숫자 타입 입니다. NumberInput 컴포넌트의 타입을 확인해 주세요.",
      );
    }

    if (!isNumber(parsedValue)) {
      onError?.("숫자만 입력해 주세요.");
    }

    setLocalValue(parsedValue); // onChange 대신 localValue 업데이트
  };

  const formatValue = () => {
    const valueToFormat = isFocused ? localValue : value; // 포커스 상태에 따라 다른 값 사용

    if (!valueToFormat && valueToFormat !== 0) return "";

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
        onBlur={(_e) => {
          setIsFocused(false);

          // onBlur에서 부모 컴포넌트에 값 전달
          if (isNumber(localValue)) {
            onChange?.(localValue);
          }
        }}
      />
    </label>
  );
};

export default NumberInput;
