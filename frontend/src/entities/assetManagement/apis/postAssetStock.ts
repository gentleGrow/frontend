import { fetchWithTimeout } from "@/shared";

export interface PostAssetStockRequestBody {
  buy_date: string;
  purchase_currency_type: string;
  quantity: number;
  stock_code: string;
  account_type: string | null;
  investment_bank: string | null;
  purchase_price: number | null;
  tempId: number;
}
export const postAssetStock = async (
  accessToken: string,
  body: PostAssetStockRequestBody,
) => {
  return fetchWithTimeout(`/api/v1/assetstock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
};
