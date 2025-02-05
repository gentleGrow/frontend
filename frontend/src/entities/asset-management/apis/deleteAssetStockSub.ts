import { fetchWithTimeout } from "@/shared";
import { getServiceServerUrl } from "@/shared/utils/getServiceServerUrl";

export const deleteAssetStockSub = async (accessToken: string, id: number) =>
  fetchWithTimeout(`${getServiceServerUrl()}/api/asset/v1/assetstock/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
