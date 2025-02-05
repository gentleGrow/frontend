import { fetchWithTimeout } from "@/shared";
import { getServiceServerUrl } from "@/shared/utils/getServiceServerUrl";

export const deleteAssetStockParent = async (
  accessToken: string,
  code: string,
) =>
  fetchWithTimeout(
    `${getServiceServerUrl()}/api/asset/v1/assetstock/stock/${code}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
