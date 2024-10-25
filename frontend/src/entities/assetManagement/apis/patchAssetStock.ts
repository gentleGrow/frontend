import { SERVICE_SERVER_URL } from "@/shared";

export interface PatchAssetStockRequestBody {
  id: number;
  buy_date: string | null;
  purchase_currency_type: string | null;
  quantity: number | null;
  stock_code: string | null;
  account_type: string | null;
  investment_bank: string | null;
  purchase_price: number | null;
}
export const patchAssetStock = async (
  accessToken: string,
  body: PatchAssetStockRequestBody,
) => {
  return fetch(`${SERVICE_SERVER_URL}/api/v1/assetstock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
};
