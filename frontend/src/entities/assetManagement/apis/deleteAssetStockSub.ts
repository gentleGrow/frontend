import { fetchWithTimeout, getBaseUrl } from "@/shared";

export const deleteAssetStockSub = async (accessToken: string, id: number) =>
  fetchWithTimeout(`${getBaseUrl()}/api/asset/v1/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
