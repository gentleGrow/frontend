import { fetchWithTimeout, SERVICE_SERVER_URL } from "@/shared";
export interface Summary {
  today_review_rate: number;
  total_asset_amount: number;
  total_investment_amount: number;
  profit: {
    profit_amount: number;
    profit_rate: number;
  };
}

const fetchSampleSummary = async (): Promise<Summary> => {
  try {
    const response = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/chart/v1/sample/summary`,
    );
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

export default fetchSampleSummary;
