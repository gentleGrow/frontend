import { CurrencyType } from "@/widgets/asset-management-draggable-table/constants/currencyType";

export const precisionByCurrency: Record<keyof typeof CurrencyType, number> = {
  KRW: 0,
  USD: 2,
};
