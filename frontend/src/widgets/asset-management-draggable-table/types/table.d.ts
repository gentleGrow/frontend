import { allField } from "@/widgets/asset-management-draggable-table/constants/allField";
import { ColumnType } from "@/features/assetManagement/consts/column-type";

export interface AssetValue<T extends string | number | null> {
  isRequired: boolean;
  value: T;
  changedValue?: T extends number ? number : undefined;
}

export interface StockAssetParent {
  종목명: string;
  수익률: number;
  수익금: number;
  배당금: number;
}

export interface StockAssetSub {
  계좌종류: AssetValue<string | null>;
  매매일자: AssetValue<string>;
  현재가: AssetValue<number | null>;
  배당금: AssetValue<number | null>;
  고가: AssetValue<number | null>;
  증권사: AssetValue<string | null>;
  저가: AssetValue<number | null>;
  시가: AssetValue<number | null>;
  수익률: AssetValue<number | null>;
  수익금: AssetValue<number | null>;
  거래가: AssetValue<number | null>;
  수량: AssetValue<number>;
  종목명: AssetValue<string>;
  거래량: AssetValue<number | null>;
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
  type: ColumnType.Parent;
};
