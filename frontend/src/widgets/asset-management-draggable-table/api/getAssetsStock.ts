import { SERVICE_SERVER_URL } from "@/shared";
import { AssetStock } from "@/widgets/asset-management-draggable-table/types/table";

export const getAssetsStock = async (accessToken: string | null) => {
  if (!accessToken) {
    const mockData = await fetch(
      `${SERVICE_SERVER_URL}/api/v1/sample/assetstock`,
    );

    if (!mockData.ok) {
      throw new Error(`${mockData.status}: ${await mockData.json()}`);
    }

    return (await mockData.json()) as AssetStock;
  }

  const response = await fetch(`${SERVICE_SERVER_URL}/api/v1/assetstock`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.json()}`);
  }

  return (await response.json()) as AssetStock;
};
