import { fetchWithTimeout, getServiceUrl } from "@/shared";

export interface PutAssetStockRequestBody {
  id: number;
  trade_date?: string;
  purchase_currency_type?: string;
  quantity?: number;
  stock_code: string;
  account_type?: string;
  investment_bank?: string;
  trade_price?: number;
  trade?: string;
}

export const putAssetStock = async (
  accessToken: string,
  body: PutAssetStockRequestBody,
) => {
  return fetchWithTimeout(`${getServiceUrl()}/api/asset/v1/assetstock`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
};
