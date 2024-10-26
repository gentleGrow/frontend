import { fetchWithTimeout } from "@/shared";

export const deleteAssetStock = async (accessToken: string, id: number) =>
  fetchWithTimeout(`/api/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
