import { fetchWithTimeout, getBaseUrl } from "@/shared";

export interface ItemName {
  name_en: string;
  name_kr: string;
  code: string;
}

export const getItemNameList = async (accessToken: string | null) => {
  const response = await fetchWithTimeout(`${getBaseUrl()}/api/v1/stocks`);

  if (!response.ok) {
    throw new Error("Failed to fetchWithTimeout item name list");
  }

  return (await response.json()) as ItemName[];
};
