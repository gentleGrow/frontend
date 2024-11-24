import { fetchWithTimeout, getBaseUrl } from "@/shared";

export interface PostAssetStockRequestBody {
  trade_date: string | null;
  purchase_currency_type: string | null;
  quantity: number | null;
  stock_code: string | null;
  account_type: string | null;
  investment_bank: string | null;
  trade_price: number | null;
  trade: "매매" | "매수" | null;
}
export const postAssetStock = async (accessToken: string) => {
  return fetchWithTimeout(`${getBaseUrl()}/api/asset/v2/assetstock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      trade_date: null,
      purchase_currency_type: null,
      quantity: null,
      stock_code: null,
      account_type: null,
      investment_bank: null,
      trade_price: null,
      trade: null,
    }),
  });
};
