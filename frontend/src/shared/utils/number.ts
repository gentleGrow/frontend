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
    return `${value.toFixed(2)}`;
  }

  return integerPart;
}

function hasMoreThanTwoDecimalPlaces(num: string) {
  return num.length > 2;
}

export function deCommaizeNumber(value: string) {
  return value.replace(/,/g, "");
}

export function isNumber(value: number | null) {
  if (value === null) {
    return false;
  }
  return !isNaN(Number(value));
}

export function extractNumber(value: string) {
  return value.replace(/[^\d.-]/g, "");
}
