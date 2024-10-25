import { SERVICE_SERVER_URL } from "@/shared";

export const deleteAssetStock = async (accessToken: string, id: number) =>
  fetch(`${SERVICE_SERVER_URL}/api/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
