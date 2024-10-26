import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";

export interface ItemName {
  name: string;
  code: string;
}

export const getItemNameList = async (accessToken: string | null) => {
  // if (!accessToken) return [] as ItemName[];

  const response = await fetchWithTimeout(
    `${SERVICE_SERVER_URL}/api/v1/stocks`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetchWithTimeout item name list");
  }

  return (await response.json()) as ItemName[];
};
