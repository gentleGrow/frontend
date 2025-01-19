import { PutAssetStockRequestBody } from "@/entities/assetManagement/apis/putAssetStock";

type JsonKey = keyof PutAssetStockRequestBody;

export const parseAssetStockKeyToJsonKey = (key: string): JsonKey => {
  switch (key) {
    case "매매일자":
      return "trade_date";
    case "수량":
      return "quantity";
    case "계좌종류":
      return "account_type";
    case "증권사":
      return "investment_bank";
    case "거래가":
      return "trade_price";
    case "매매":
      return "trade";
    default:
      throw new Error("유효하지 않은 키값 입니다.");
  }
};
