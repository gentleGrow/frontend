import { BarChartData, DonutChartData, SERVICE_SERVER_URL } from "@/shared";

const fetchDummyEstimateDividend = async (
  category: "every" | "type" = "every",
): Promise<BarChartData | DonutChartData[]> => {
  try {
    const response = await fetch(
      `${SERVICE_SERVER_URL}/api/chart/v1/sample/estimate-dividend?category=${category}`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    const estimateDividend = await response.json();

    return estimateDividend;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchDummyEstimateDividend;
