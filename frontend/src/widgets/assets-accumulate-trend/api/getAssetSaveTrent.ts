import { fetchWithTimeout, getServiceUrl, LineChartData } from "@/shared";

export const getAssetSaveTrent = async (accessToken: string | null) => {
  let url = `${getServiceUrl()}/api/chart/v1/asset-save-trend`;
  if (!accessToken) {
    url = `${getServiceUrl()}/api/chart/v1/sample/asset-save-trend`;
  }

  const response = await fetchWithTimeout(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.json()}`);
  }

  return (await response.json()) as LineChartData;
};
