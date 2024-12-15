import { fetchWithTimeout, getBaseUrl } from "@/shared";

export interface PostAssetStockRequestBody {
  buy_date: string;
  purchase_currency_type: string;
  quantity: number;
  stock_code: string;
  account_type: string | null;
  investment_bank: string | null;
  purchase_price: number | null;
  // Tanstack Query 에서 낙관적 업데이트에 사용될 id를 캐싱하기 위해 받고 있습니다.
  tempId: number;
}

export const postAssetStock = async (
  accessToken: string,
  body: PostAssetStockRequestBody,
) => {
  return fetchWithTimeout(`${getBaseUrl()}/api/asset/v1/assetstock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify(body),
  });
};
