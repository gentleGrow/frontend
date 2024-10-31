export const CurrencyType = {
  KRW: "KRW",
  USD: "USD",
} as const;

export type CurrencyType = (typeof CurrencyType)[keyof typeof CurrencyType];
