import { AssetManagementResponse } from "@/widgets/asset-management-draggable-table/types/table";
import { getServiceUrl } from "@/shared/utils/getServiceUrl";

export const getAssetsStock = async (accessToken: string | null) => {
  if (!accessToken) {
    const mockData = await fetch(
      `${getServiceUrl()}/api/asset/v1/sample/assetstock`,
    );

    if (!mockData.ok) {
      throw new Error(`${mockData.status}: ${await mockData.json()}`);
    }

    return (await mockData.json()) as AssetManagementResponse;
  }

  const response = await fetch(`${getServiceUrl()}/api/asset/v1/assetstock`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.json()}`);
  }

  return (await response.json()) as AssetManagementResponse;
};
