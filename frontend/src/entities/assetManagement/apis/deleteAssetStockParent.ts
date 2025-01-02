import { fetchWithTimeout, getBaseUrl } from "@/shared";

export const deleteAssetStockParent = async (accessToken: string, id: string) =>
  fetchWithTimeout(`${getBaseUrl()}/api/asset/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
