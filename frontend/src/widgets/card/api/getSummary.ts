import { SERVICE_SERVER_URL as API_URL } from "@/shared";
import { API_CHART_SUFFIX } from "@/shared/constants/api";

export interface GetSummaryResponse {
  today_review_rate: number;
  total_asset_amount: number;
  total_investment_amount: number;
  profit: {
    profit_amount: number;
    profit_rate: number;
  };
}

export const getSummary = async () => {
  const response = await fetch(`${API_URL}/${API_CHART_SUFFIX}/summary`);

  if (!response.ok) {
    throw new Error("요약 데이터를 받아오는데 실패했습니다.");
  }

  return (await response.json()) as GetSummaryResponse;
};
