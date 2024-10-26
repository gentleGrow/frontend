import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";

export const deleteAssetStock = async (accessToken: string, id: number) =>
  fetchWithTimeout(`${SERVICE_SERVER_URL}/api/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
