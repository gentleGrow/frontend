import { fetchWithTimeout, getServiceUrl } from "@/shared";

export const deleteAssetStockParent = async (
  accessToken: string,
  code: string,
) =>
  fetchWithTimeout(`${getServiceUrl()}/api/asset/v1/assetstock/stock/${code}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
