import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";

export interface Summary {
  increase_asset_amount: number;
  total_asset_amount: number;
  total_investment_amount: number;
  profit: {
    profit_amount: number;
    profit_rate: number;
  };
}

export const fetchSummary = async (): Promise<Summary> => {
  const response = await fetchWithTimeout(
    `${SERVICE_SERVER_URL}/api/chart/v1/summary`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
      },
      revalidate: 0,
    },
  );

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.json()}`);
  }

  return response.json();
};

export const fetchSampleSummary = async (): Promise<Summary> => {
  const response = await fetchWithTimeout(
    `${SERVICE_SERVER_URL}/api/chart/v1/sample/summary`,
  );
  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.json()}`);
  }
  return response.json();
};
