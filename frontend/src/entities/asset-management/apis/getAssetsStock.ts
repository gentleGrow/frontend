import { AssetStock } from "@/entities/asset-management/types/asset-management";
import { baseAxios } from "@/shared/lib/axios";
import { getServiceUrl } from "@/shared";

export const getAssetsStock = async (accessToken: string | null) => {
  if (!accessToken) {
    const mockData = await baseAxios.get(
      `${getServiceUrl()}/api/asset/v1/sample/assetstock`,
    );

    return (await mockData.data) as AssetStock;
  }

  const response = await baseAxios.get(
    `${getServiceUrl()}/api/asset/v1/assetstock`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return (await response.data) as AssetStock;
};
