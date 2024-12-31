import { StockAsset } from "@/widgets/asset-management-draggable-table/types/table";

export function createEmptyStockAsset(): StockAsset {
  return {
    parent: {
      종목명: "",
      배당금: 0,
      수익금: 0,
      수익률: 0,
    },
    sub: [],
  };
}
