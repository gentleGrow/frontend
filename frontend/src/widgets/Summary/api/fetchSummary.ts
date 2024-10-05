import { SERVICE_SERVER_URL } from "@/shared";
import { ACCESS_TOKEN } from "@/shared/constants/cookie";
import { cookies } from "next/headers";
export interface Summary {
  today_review_rate: number;
  total_asset_amount: number;
  total_investment_amount: number;
  profit: {
    profit_amount: number;
    profit_rate: number;
  };
}

const fetchSummary = async (): Promise<Summary> => {
  try {
    const response = await fetch(`${SERVICE_SERVER_URL}/api/chart/v1/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies().get(ACCESS_TOKEN)?.value,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return {
      today_review_rate: 0,
      total_asset_amount: 0,
      total_investment_amount: 0,
      profit: {
        profit_amount: 0,
        profit_rate: 0,
      },
    };
  }
};

export default fetchSummary;
