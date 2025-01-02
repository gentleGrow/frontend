import { StockAsset } from "@/widgets/asset-management-draggable-table/types/table";
import { createEmptyStockId } from "@/entities/assetManagement/utils/tempIdUtils";

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
