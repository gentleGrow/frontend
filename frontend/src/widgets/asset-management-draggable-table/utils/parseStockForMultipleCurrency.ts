import { cloneDeep } from "es-toolkit";
import { ceil } from "es-toolkit/compat";
import {
  StockAssetParentWithType,
  StockAssetSub,
  StockAssetSubWithType,
} from "@/widgets/asset-management-draggable-table/types/table";
import { priceInputFields } from "@/widgets/asset-management-draggable-table/constants/priceInputFields";
import { CurrencyType } from "@/widgets/asset-management-draggable-table/constants/currencyType";
import { precisionByCurrency } from "@/widgets/asset-management-draggable-table/constants/precisionByCurrency";
import { ColumnType } from "@/features/assetManagement/consts/column-type";

export const isSub = (
  stock: StockAssetSubWithType | StockAssetParentWithType,
): stock is StockAssetSub & { type: typeof ColumnType.Sub } => {
  return stock.type === ColumnType.Sub;
};

export const parseStockForMultipleCurrency = (
  stock: StockAssetSubWithType | StockAssetParentWithType,
  {
    wonExchange,
    dollarExchange,
  }: { wonExchange: number; dollarExchange: number },
) => {
  if (!isSub(stock)) {
    return stock;
  }

  const newStock = cloneDeep(stock);
  priceInputFields.forEach((field) => {
    const currentCurrency = stock.주식통화;
    if (!newStock[field]) return;
    if (
      currentCurrency === CurrencyType.USD &&
      typeof newStock[field].value === "number"
    ) {
      newStock[field].changedValue = ceil(
        newStock[field].value * wonExchange,
        precisionByCurrency[CurrencyType.KRW],
      );
    } else if (
      currentCurrency === CurrencyType.KRW &&
      typeof newStock[field].value === "number"
    ) {
      newStock[field].changedValue = ceil(
        newStock[field].value * dollarExchange,
        precisionByCurrency[CurrencyType.USD],
      );
    }
  });

  return {
    ...newStock,
  };
};
