import { fetchWithTimeout, getServiceUrl } from "@/shared";

export const deleteAssetStockSub = async (accessToken: string, id: number) =>
  fetchWithTimeout(`${getServiceUrl()}/api/asset/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
