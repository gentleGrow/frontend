import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";

export const deleteAssetStockParent = async (accessToken: string, id: string) =>
  fetchWithTimeout(`${SERVICE_SERVER_URL}/api/asset/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
