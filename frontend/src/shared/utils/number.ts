import { ceil } from "es-toolkit/compat";

export function commaizeNumber(value: string | number) {
  const numStr = String(value);
  const decimalPointIndex = numStr.indexOf(".");
  const commaizeRegExp = /(\d)(?=(\d\d\d)+(?!\d))/g;

  return decimalPointIndex > -1
    ? numStr.slice(0, decimalPointIndex).replace(commaizeRegExp, "$1,") +
        numStr.slice(decimalPointIndex)
    : numStr.replace(commaizeRegExp, "$1,");
}

export function fixedNumberIfNeeds(value: number) {
  const decimalSliced = String(value).split(".");
  const integerPart = decimalSliced[0];
  const decimalPart = decimalSliced[1] as string | undefined;

  if (decimalPart !== undefined && hasMoreThanTwoDecimalPlaces(decimalPart)) {
    return `${value.toFixed(0)}`;
  }

  return integerPart;
}

function hasMoreThanTwoDecimalPlaces(num: string) {
  return num.length > 2;
}

export function deCommaizeNumber(value: string) {
  return value.replace(/,/g, "");
}

export function isNumber(value: number | null): value is number {
  if (value === null) {
    return false;
  }
  return !isNaN(Number(value));
}

export function extractNumber(value: string | number): string | null {
  value = String(value);
  const result = value.match(/[-\d,.]+/g);
  if (!result) return null;

  const numberStr = result[0].replace(/,/g, "");

  // 입력 값이 숫자 형식에 맞는지 확인 (소수점 뒤에 숫자가 없어도 허용)
  const isNumeric = /^-?\d+(\.\d*)?$/.test(numberStr);

  if (isNumeric) {
    // 숫자로 변환하지 않고 문자열 그대로 반환하여 형식을 유지
    return numberStr;
  } else {
    // 유효하지 않은 숫자 형식인 경우 null 반환
    return null;
  }
}

export function containsInvalidInput(value: string): boolean {
  const lastChar = value.slice(-1);
  const isNumber = !isNaN(Number(lastChar));
  const isDot = lastChar === ".";
  const isComma = lastChar === ",";
  const isMinus = lastChar === "-";
  const isPlus = lastChar === "+";

  return !isNumber && !isDot && !isComma && !isMinus && !isPlus;
}

export function exchange(value: string | number, exchangeRate: number) {
  return ceil(value, 0);
}
