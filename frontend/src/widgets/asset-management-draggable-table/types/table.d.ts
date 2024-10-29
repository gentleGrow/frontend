import { assetManagementMockData } from "@/widgets/asset-management-draggable-table/api/mock";

export interface AssetValue {
  isRequired: boolean;
  value: string | number | null;
  changedValue?: string | number | null;
}

export interface StorkAssetFields {
  계좌종류: AssetValue;
  구매일자: AssetValue;
  현재가: AssetValue;
  배당금: AssetValue;
  고가: AssetValue;
  증권사: AssetValue;
  저가: AssetValue;
  시가: AssetValue;
  수익률: AssetValue;
  수익금: AssetValue;
  매입금: AssetValue;
  매입가: AssetValue;
  수량: AssetValue;
  종목명: AssetValue;
  거래량: AssetValue;
}

export interface StockAssetOverview {
  total_asset_amount: number;
  total_invest_amount: number;
  total_profit_rate: number;
  total_profit_amount: number;
  total_dividend_amount: number;
}

export type StockAsset = StorkAssetFields & {
  id: number;
  주식통화: "KRW" | "USD";
};

export type AssetManagementResponse = StockAssetOverview & {
  stock_assets: StockAsset[];
  asset_fields: string[];
  dollar_exchange: number;
  won_exchange: number;
};

export type AssetStock = typeof assetManagementMockData;
