import {
  StockAssetParentWithType,
  StockAssetSub,
  StockAssetSubWithType,
} from "@/entities/asset-management/types/asset-management";
import { ColumnType } from "@/features/asset-management/consts/column-type";

export const isSub = (
  stock: StockAssetSubWithType | StockAssetParentWithType,
): stock is StockAssetSub & { type: typeof ColumnType.Sub } => {
  return stock.type === ColumnType.Sub;
};

export const parseStockForMultipleCurrency = (
  stock: StockAssetParentWithType | StockAssetSubWithType,
  {
    // wonExchange,
    // dollarExchange,
  }: { wonExchange: number; dollarExchange: number },
) => {
  return stock;
};
