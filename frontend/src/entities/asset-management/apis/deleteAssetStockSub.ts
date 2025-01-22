import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";

export const deleteAssetStockSub = async (accessToken: string, id: number) =>
  fetchWithTimeout(`${SERVICE_SERVER_URL}/api/asset/v1/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
