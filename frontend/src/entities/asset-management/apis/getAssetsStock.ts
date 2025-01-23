import { AssetStock } from "@/entities/asset-management/types/asset-management";
import { baseAxios } from "@/shared/lib/axios";
import { getServiceServerUrl } from "@/shared/utils/getServiceServerUrl";

export const getAssetsStock = async (accessToken: string | null) => {
  console.log("getAssetsStock: ", getServiceServerUrl());

  if (!accessToken) {
    const mockData = await baseAxios.get(
      `${getServiceServerUrl()}/api/asset/v1/sample/assetstock`,
    );

    return (await mockData.data) as AssetStock;
  }

  const response = await baseAxios.get(
    `${getServiceServerUrl()}/api/asset/v1/assetstock`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return (await response.data) as AssetStock;
};
