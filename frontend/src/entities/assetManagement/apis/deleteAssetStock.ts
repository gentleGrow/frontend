import { fetchWithTimeout, getBaseUrl } from "@/shared";

export const deleteAssetStock = async (accessToken: string, id: number) =>
  fetchWithTimeout(`${getBaseUrl()}/api/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
