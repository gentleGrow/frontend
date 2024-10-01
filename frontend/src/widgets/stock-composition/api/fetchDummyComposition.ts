import { DonutChartData, SERVICE_SERVER_URL } from "@/shared";

const fetchDummyComposition = async (
  type: "composition" | "account" = "composition",
): Promise<DonutChartData[]> => {
  try {
    const response = await fetch(
      `${SERVICE_SERVER_URL}/api/chart/v1/sample/composition?type=${type}`,
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
