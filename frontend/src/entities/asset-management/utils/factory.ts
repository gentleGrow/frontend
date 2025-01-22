import { StockAsset } from "@/entities/asset-management/types/asset-management";
import { createEmptyStockId } from "@/entities/asset-management/utils/tempIdUtils";

export function createEmptyStockAsset(): StockAsset {
  return {
    parent: {
      종목명: createEmptyStockId(),
      배당금: 0,
      수익금: 0,
      수익률: 0,
    },
    sub: [],
  };
}
