import { AssetManagementResponse } from "@/widgets/asset-management-draggable-table/types/table";
import { baseAxios } from "@/shared/lib/axios";
import { getServiceServerUrl } from "@/shared/utils/getServiceServerUrl";

export const getAssetsStock = async (accessToken: string | null) => {
  if (!accessToken) {
    const mockData = await baseAxios.get(
      `${getServiceServerUrl()}/api/asset/v1/sample/assetstock`,
    );

    return (await mockData.data) as AssetManagementResponse;
  }

  const response = await baseAxios.get(
    `${getServiceServerUrl()}/api/asset/v1/assetstock`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return (await response.data) as AssetManagementResponse;
};
