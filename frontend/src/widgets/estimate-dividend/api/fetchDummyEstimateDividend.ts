import {
  DonutChartData,
  EstimateDividendAllData,
  fetchWithTimeout,
  SERVICE_SERVER_URL,
} from "@/shared";

const fetchDummyEstimateDividend = async (
  category: "every" | "type" = "every",
): Promise<EstimateDividendAllData | DonutChartData[]> => {
  try {
    const response = await fetchWithTimeout(
      `${SERVICE_SERVER_URL}/api/chart/v1/sample/estimate-dividend?category=${category}`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    const estimateDividend = await response.json();

    return estimateDividend;
  } catch (error) {
    console.error(error);
    if (category === "every") {
      return {
        2024: {
          xAxises: [],
          data: [],
          unit: "",
          total: 0,
        },
      };
    }
    return [];
  }
};

export default fetchDummyEstimateDividend;
