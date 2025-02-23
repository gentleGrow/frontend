import { DonutChartData, fetchWithTimeout, getServiceUrl } from "@/shared";

const fetchDummyComposition = async (
  type: "composition" | "account" = "composition",
): Promise<DonutChartData[]> => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/sample/composition?type=${type}`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchDummyComposition;
