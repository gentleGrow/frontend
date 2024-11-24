import { fetchWithTimeout, getBaseUrl } from "@/shared";
import { AssetManagementResponse } from "@/widgets/asset-management-draggable-table/types/table";

export const getAssetsStock = async (accessToken: string | null) => {
  if (!accessToken) {
    const mockData = await fetchWithTimeout(
      `${getBaseUrl()}/api/v1/sample/assetstock`,
    );

    if (!mockData.ok) {
      throw new Error(`${mockData.status}: ${await mockData.json()}`);
    }

    return (await mockData.json()) as AssetManagementResponse;
  }

  const response = await fetchWithTimeout(
    `${getBaseUrl()}/api/asset/v2/assetstock`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.json()}`);
  }

  return (await response.json()) as AssetManagementResponse;
};
