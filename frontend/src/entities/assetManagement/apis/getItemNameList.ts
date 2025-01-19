import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";

export interface ItemName {
  name_en: string;
  name_kr: string;
  code: string;
}

export const getItemNameList = async (accessToken: string | null) => {
  const response = await fetchWithTimeout(
    `${SERVICE_SERVER_URL}/api/asset/v1/stocks`,
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
