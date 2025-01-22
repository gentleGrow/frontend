import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";

export interface PostAssetStockRequestBody {
  trade_date?: string;
  purchase_currency_type?: string;
  quantity?: number;
  stock_code: string;
  account_type?: string;
  investment_bank?: string;
  trade_price?: number;
  trade?: "매수" | "매도";
}

export const postAssetStock = async (
  accessToken: string,
  body: PostAssetStockRequestBody,
) => {
  return fetchWithTimeout(`${SERVICE_SERVER_URL}/api/asset/v1/assetstock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify(body),
  });
};
