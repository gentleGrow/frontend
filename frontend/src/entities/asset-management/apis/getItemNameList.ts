import { fetchWithTimeout, getServiceUrl } from "@/shared";

export interface ItemName {
  name_en: string;
  name_kr: string;
  code: string;
}

export const getItemNameList = async (accessToken: string | null) => {
  const response = await fetchWithTimeout(
    `${getServiceUrl()}/api/asset/v1/stocks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetchWithTimeout item name list");
  }

  return (await response.json()) as ItemName[];
};
