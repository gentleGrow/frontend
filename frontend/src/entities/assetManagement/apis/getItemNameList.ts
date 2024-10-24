import { SERVICE_SERVER_URL } from "@/shared";

export interface ItemName {
  name: string;
  code: string;
}

export const getItemNameList = async (accessToken: string | null) => {
  // if (!accessToken) return [] as ItemName[];

  const response = await fetch(`${SERVICE_SERVER_URL}/api/v1/stocks`);

  if (!response.ok) {
    throw new Error("Failed to fetch item name list");
  }

  return (await response.json()) as ItemName[];
};
