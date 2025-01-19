import { allField } from "@/widgets/asset-management-draggable-table/constants/allField";
import { ColumnType } from "@/features/assetManagement/consts/column-type";

export interface StockAssetParent {
  종목명: string;
  수익률: number;
  수익금: number;
  배당금: number;
}

export interface StockAssetSub {
  계좌종류: string | null;
  매매일자: string;
  현재가: number | null;
  배당금: number | null;
  고가: number | null;
  증권사: string | null;
  저가: number | null;
  시가: number | null;
  수익률: number | null;
  수익금: number | null;
  거래가: number | null;
  수량: number;
  종목명: string;
  거래량: number | null;
  id: number;
  주식통화: "KRW" | "USD";
}

export interface StockAsset {
  parent: StockAssetParent;
  sub: StockAssetSub[];
}

export interface StockAssetOverview {
  total_asset_amount: number;
  total_invest_amount: number;
  total_profit_rate: number;
  total_profit_amount: number;
  total_dividend_amount: number;
}

export type AssetManagementResponse = StockAssetOverview & {
  stock_assets: StockAsset[];
  asset_fields: Partial<typeof allField>;
  dollar_exchange: number;
  won_exchange: number;
};

export type StockAssetSubWithType = StockAssetSub & {
  type: ColumnType.Sub;
};
export type StockAssetParentWithType = StockAssetParent & {
  id: string;
  type: ColumnType.Parent;
};
